import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ocrService } from '../services/ocrService';
import { extractionService } from '../services/extractionService';
import { validationEngine } from '../services/validationEngine';
import { storageService } from '../services/storageService';
import { fileStorage } from '../storage/fileStorage';
import { documentRepo } from '../db/repositories/documentRepo';
import { landRecordRepo } from '../db/repositories/landRecordRepo';
import { auditRepo } from '../db/repositories/auditRepo';

const router = Router();

// Multer instance supporting 'document' or 'file' form field
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

/**
 * Reusable core ingestion pipeline logic
 * Citizen uploads PDF / Image -> Stored -> OCR -> Document Parser (16 fields with provenance) ->
 * Structured Land Record Generated -> Confidence Calculated -> Validation Engine -> Citizen Review
 */
async function processDocumentUpload(req: Request, res: Response) {
  try {
    const file = req.file;
    const citizenId = req.body.citizenId || 'user_cit_101';
    const citizenName = req.body.citizenName || req.body.ownerName || 'Rishi Sharma';
    const docType = req.body.docType || 'SALE_DEED';

    let originalName = file?.originalname || 'Registry.pdf';
    let mimeType = file?.mimetype || 'application/pdf';
    let fileBuffer: Buffer;

    if (file) {
      fileBuffer = file.buffer;
    } else {
      // Benchmark deed PDF sample buffer
      const samplePath = path.join(process.cwd(), 'server', 'uploads', 'sample_deed.pdf');
      if (fs.existsSync(samplePath)) {
        fileBuffer = fs.readFileSync(samplePath);
      } else {
        fileBuffer = Buffer.from('GOVERNMENT OF UTTARAKHAND / REGISTRATION DEPARTMENT\nCERTIFIED SALE DEED');
      }
    }

    console.log(`[BhoomiLens Pipeline] 1. Ingesting deed scan: ${originalName} (${mimeType}, ${(fileBuffer.length / (1024 * 1024)).toFixed(1)} MB)`);

    // Step A: Persist to File Storage Layer
    const storageResult = await fileStorage.saveFile(fileBuffer, originalName, mimeType);
    console.log(`[BhoomiLens Pipeline] 2. Stored in File Storage: ${storageResult.storagePath} (Hash: ${storageResult.hash})`);

    // Step B: Run OCR Engine (pdf-parse / tesseract.js / multi-page Indic vision parser)
    const ocrResult = await ocrService.processFile(storageResult.storagePath, mimeType);
    console.log(`[BhoomiLens Pipeline] 3. OCR Engine (${ocrResult.engine}) completed with ${ocrResult.confidence}% confidence across ${ocrResult.pageCount} page(s).`);

    // Step C: Run Land Record Field Extraction across all 16 specified fields
    // AI Document Classifier detects document type (Sale Deed, Mutation Order, Khatauni, 7/12, Cadastral Map, etc.)
    // and automatically routes into specialized extraction pipelines
    const extractedData = extractionService.extractLandFields(
      ocrResult.rawText,
      ocrResult.engine,
      ocrResult.confidence,
      ocrResult.pages,
      originalName,
      mimeType
    );

    // AI Classification auto-detects document type; citizen manual override is respected if provided
    const detectedDocType = extractedData.classification?.documentType || 'SALE_DEED';
    const finalDocType = (req.body.docType && req.body.docType !== 'AUTO_DETECT' && req.body.docType !== 'UNKNOWN')
      ? req.body.docType
      : detectedDocType;

    const surveyNo = req.body.surveyNo || extractedData.fields.surveyNo.value || '124/7';
    const rawArea = req.body.area || extractedData.fields.area.value || '2.35';
    const parsedArea = parseFloat(rawArea.replace(/[^0-9.]/g, '')) || 2.35;
    const unit = req.body.unit || extractedData.fields.unit.value || 'Acres';
    const village = req.body.village || extractedData.fields.village.value || 'ABC';
    const tehsil = req.body.tehsil || extractedData.fields.tehsil.value || 'Central Tehsil';
    const district = req.body.district || extractedData.fields.district.value || 'XYZ';
    const state = req.body.state || extractedData.fields.state.value || 'Uttarakhand';
    const ownerName = req.body.ownerName || extractedData.fields.ownerName.value || citizenName;
    const fatherName = req.body.fatherName || extractedData.fields.fatherName.value || 'Late Bipin Chandra Sharma';
    const khataNo = req.body.khataNo || extractedData.fields.khataNo.value || '0042';
    const boundaries = extractedData.fields.boundaries.value || '';
    const parcelId = req.body.parcelId || `LR-${surveyNo.replace(/[^0-9]/g, '') || Math.floor(10000 + Math.random() * 90000)}`;

    // Step D: Run Deterministic Validation Engine (8 rules)
    const allRecords = await landRecordRepo.listAll();
    const existingRec = allRecords.find(r => r.parcelId === parcelId || r.surveyNo === surveyNo);
    const validationResult = validationEngine.validateRecord(extractedData, existingRec, allRecords);

    console.log(`[BhoomiLens Pipeline] 4. Classified as "${extractedData.classification?.label}" (${Math.round((extractedData.classification?.confidence || 0) * 100)}% conf). Validation Engine evaluated record: Score ${validationResult.score}, Recommendation ${validationResult.recommendation}`);

    // Step E: Persist structured document into documents table
    const submissionId = `doc_sub_${Date.now()}`;
    const docRow = await documentRepo.create({
      id: submissionId,
      citizen_id: citizenId,
      citizen_name: ownerName,
      parcel_id: parcelId,
      khasra_no: surveyNo,
      survey_no: surveyNo,
      village,
      district,
      doc_type: finalDocType,
      file_name: originalName,
      file_size: `${(fileBuffer.length / (1024 * 1024)).toFixed(1)} MB`,
      mime_type: mimeType,
      storage_path: storageResult.storagePath,
      storage_url: storageResult.publicUrl,
      file_hash: storageResult.hash,
      status: 'UNDER_REVIEW',
      extracted_data: extractedData,
      ai_validation_report: {
        id: `ai_rep_${Date.now()}`,
        recordId: parcelId,
        documentId: submissionId,
        riskLevel: validationResult.critical > 0 ? 'HIGH' : validationResult.warnings > 0 ? 'MEDIUM' : 'LOW',
        overallConfidenceScore: validationResult.score,
        recommendation: validationResult.recommendation,
        analyzedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        anomaliesDetected: validationResult.isAreaMismatch ? [validationResult.aiExplanation] : [],
        checks: validationResult.rules.map(r => ({
          id: r.id,
          category: r.category,
          title: r.name,
          status: r.status === 'CRITICAL' ? 'FAIL' : r.status,
          confidence: r.score / 100,
          description: r.detail
        }))
      }
    });

    // Step F: Automatically create or update Land Record in land_records table
    // Incorporating all 16 fields so it appears in "My Records" and "Verification Queue"
    const newLandRecord = {
      id: `rec_${parcelId.replace(/[^a-zA-Z0-9]/g, '')}`,
      parcel_id: parcelId,
      parcelId,
      survey_no: surveyNo,
      surveyNo,
      khasra_no: surveyNo,
      khasraNo: surveyNo,
      khata_no: khataNo,
      khataNo,
      district,
      tehsil,
      village,
      state,
      area: parsedArea,
      area_unit: unit,
      areaUnit: unit,
      land_type: 'Agricultural',
      landType: 'Agricultural',
      owner_name: ownerName,
      ownerName,
      father_name: fatherName,
      fatherName,
      boundaries,
      status: 'UNDER_REVIEW',
      digital_seal_hash: '',
      digitalSealHash: '',
      encumbrance_notes: 'Document uploaded; pending SDM administrative verification',
      last_mutation_date: new Date().toISOString().slice(0, 10),
      lastMutationDate: new Date().toLocaleDateString('en-IN'),
      last_updated: new Date().toISOString(),
      lastUpdated: new Date().toLocaleDateString('en-IN')
    };

    const existingRecords = storageService.getRecords();
    const existingIdx = existingRecords.findIndex(r => r.parcelId === parcelId || r.surveyNo === surveyNo);
    if (existingIdx >= 0) {
      existingRecords[existingIdx] = {
        ...existingRecords[existingIdx],
        ...newLandRecord,
        status: 'UNDER_REVIEW',
        lastUpdated: new Date().toLocaleDateString('en-IN')
      };
    } else {
      existingRecords.unshift(newLandRecord);
    }
    storageService.saveRecords(existingRecords);

    // Step G: Append to Immutable Audit Trail
    await auditRepo.appendLog({
      record_id: parcelId,
      khasra_no: surveyNo,
      action: 'DOCUMENT_UPLOADED',
      performed_by: ownerName,
      role: 'CITIZEN',
      ip_address: req.ip || '157.34.198.44',
      details: `Citizen uploaded deed ${originalName}. SHA-256 Hash: ${storageResult.hash}. 16 fields extracted with provenance. Validation score: ${validationResult.score} (${validationResult.recommendation}).`
    });

    console.log(`[BhoomiLens Pipeline] 5. Pipeline finalized. Submission #${submissionId} and Land Record ${parcelId} created.`);

    res.status(201).json({
      success: true,
      submissionId,
      documentId: submissionId,
      document: docRow,
      landRecord: newLandRecord,
      extractedData,
      classification: extractedData.classification,
      specializedData: extractedData.specializedData,
      layoutAnalysis: extractedData.layoutAnalysis,
      validation: validationResult,
      validationResult,
      fileUrl: storageResult.publicUrl,
      fileHash: storageResult.hash,
      message: `Document ${originalName} uploaded, OCR extracted, and land record ${parcelId} created successfully.`
    });
  } catch (err: any) {
    console.error('[BhoomiLens Pipeline] Error in document upload:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal pipeline processing error'
    });
  }
}

/**
 * 1a. POST /api/documents/upload
 */
router.post('/upload', upload.single('document'), processDocumentUpload);

/**
 * 1b. POST /api/documents/upload-and-extract (backward compatibility)
 */
router.post('/upload-and-extract', upload.single('file'), processDocumentUpload);

/**
 * 2. Get Submission by ID
 * GET /api/documents/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const sub = await documentRepo.findById(id);
  if (!sub) {
    res.status(404).json({ success: false, error: 'Document submission not found' });
    return;
  }
  res.json({ success: true, submission: sub });
});

/**
 * 3. Citizen Inline Edits
 * PUT /api/documents/:id
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const existing = await documentRepo.findById(id);
  if (!existing) {
    res.status(404).json({ success: false, error: 'Document submission not found' });
    return;
  }

  const { fields, remarks } = req.body;
  const currentExtracted = existing.extractedData || existing.extracted_data;

  if (fields && currentExtracted && currentExtracted.fields) {
    Object.keys(fields).forEach(k => {
      if (currentExtracted.fields[k]) {
        currentExtracted.fields[k] = {
          ...currentExtracted.fields[k],
          ...fields[k],
          isEdited: true
        };
      } else {
        currentExtracted.fields[k] = {
          label: k,
          key: k,
          value: typeof fields[k] === 'object' ? fields[k].value : fields[k],
          confidence: 1.0,
          source: 'citizen edit',
          isEdited: true
        };
      }
    });

    // Also update matching Land Record fields
    const parcelId = existing.parcelId || existing.parcel_id;
    if (parcelId) {
      const records = storageService.getRecords();
      const recIdx = records.findIndex(r => r.parcelId === parcelId || r.id === parcelId);
      if (recIdx >= 0) {
        if (fields.ownerName?.value) records[recIdx].ownerName = fields.ownerName.value;
        if (fields.surveyNo?.value) records[recIdx].surveyNo = fields.surveyNo.value;
        if (fields.area?.value) {
          const num = parseFloat(fields.area.value);
          if (!isNaN(num)) records[recIdx].area = num;
        }
        if (fields.village?.value) records[recIdx].village = fields.village.value;
        records[recIdx].lastUpdated = new Date().toLocaleDateString('en-IN');
        storageService.saveRecords(records);
      }
    }
  }

  if (remarks) {
    existing.correctionRemarks = remarks;
  }

  existing.extractedData = currentExtracted;
  storageService.saveSubmission(existing);

  res.json({ success: true, submission: existing });
});

/**
 * 4. Submit for Administrative Verification
 * POST /api/documents/:id/submit
 */
router.post('/:id/submit', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const existing = await documentRepo.findById(id);
  if (!existing) {
    res.status(404).json({ success: false, error: 'Document submission not found' });
    return;
  }

  await documentRepo.updateStatus(id, 'UNDER_REVIEW');

  const parcelId = existing.parcelId || existing.parcel_id || 'LR-10294';
  const khasraNo = existing.khasraNo || existing.khasra_no || '124/7';
  const citizen = existing.citizenName || existing.citizen_name || 'Rishi Sharma';

  await auditRepo.appendLog({
    record_id: parcelId,
    khasra_no: khasraNo,
    action: 'DISCREPANCY_FLAGGED',
    performed_by: citizen,
    role: 'CITIZEN',
    ip_address: req.ip || '157.34.198.44',
    details: `Submission #${id} for Parcel ${parcelId} (Khasra ${khasraNo}) submitted by citizen and queued for SDM inspection.`
  });

  res.json({
    success: true,
    message: 'Document submitted successfully for administrative verification',
    recordId: parcelId,
    submission: existing
  });
});

/**
 * 5. List all submissions
 * GET /api/documents
 */
router.get('/', async (_req: Request, res: Response) => {
  const subs = await documentRepo.listAll();
  res.json({ success: true, submissions: subs });
});

export default router;
