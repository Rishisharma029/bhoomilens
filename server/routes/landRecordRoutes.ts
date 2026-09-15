import { Router, Request, Response } from 'express';
import { landRecordRepo } from '../db/repositories/landRecordRepo';
import { auditRepo } from '../db/repositories/auditRepo';
import { LandRecord, LandRecordStatus } from '../db/models';

const router = Router();

/**
 * Normalizes a record object to include both camelCase and snake_case properties
 * so all UI components and API consumers receive predictable shapes.
 */
function normalizeRecord(rec: any) {
  const parcelId = rec.parcel_id || rec.parcelId || 'LR-10294';
  const surveyNo = rec.survey_no || rec.surveyNo || '124/7';
  const khasraNo = rec.khasra_no || rec.khasraNo || surveyNo;
  const ownerName = rec.owner_name || rec.ownerName || 'Rishi Sharma';
  const area = typeof rec.area === 'number' ? rec.area : parseFloat(rec.area) || 2.35;
  const areaUnit = rec.area_unit || rec.areaUnit || 'Acres';
  const village = rec.village || 'ABC';
  const district = rec.district || 'XYZ';
  const tehsil = rec.tehsil || 'Sadar';
  const status = rec.status || 'VERIFIED';
  const lastUpdated = rec.last_updated || rec.lastUpdated || new Date().toLocaleDateString('en-IN');
  const digitalSealHash = rec.digital_seal_hash || rec.digitalSealHash || '';

  return {
    id: rec.id || `rec_${parcelId.replace(/[^a-zA-Z0-9]/g, '')}`,
    parcelId,
    parcel_id: parcelId,
    surveyNo,
    survey_no: surveyNo,
    khasraNo,
    khasra_no: khasraNo,
    khataNo: rec.khata_no || rec.khataNo || '00142',
    khata_no: rec.khata_no || rec.khataNo || '00142',
    ownerName,
    owner_name: ownerName,
    fatherName: rec.father_name || rec.fatherName || 'Late Kedarnath Sharma',
    father_name: rec.father_name || rec.fatherName || 'Late Kedarnath Sharma',
    area,
    areaUnit,
    area_unit: areaUnit,
    landType: rec.land_type || rec.landType || 'Agricultural',
    land_type: rec.land_type || rec.landType || 'Agricultural',
    village,
    district,
    tehsil,
    status,
    digitalSealHash,
    digital_seal_hash: digitalSealHash,
    lastUpdated,
    last_updated: lastUpdated,
    encumbranceNotes: rec.encumbrance_notes || rec.encumbranceNotes || 'Clear Title'
  };
}

/**
 * 1. List All Land Records (Search & Filters)
 * GET /api/land-records
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search, owner } = req.query;
    let records = await landRecordRepo.listAll();

    let normalized = records.map(normalizeRecord);

    // Filter by status (All / Verified / Under Review / Action Required / Conflict)
    if (status && status !== 'ALL') {
      const target = String(status).toUpperCase().replace(/\s+/g, '_');
      normalized = normalized.filter(r => r.status === target);
    }

    // Filter by owner
    if (owner) {
      const ownerStr = String(owner).toLowerCase();
      normalized = normalized.filter(r => r.ownerName.toLowerCase().includes(ownerStr));
    }

    // Search term across parcel, survey, owner, village
    if (search) {
      const q = String(search).toLowerCase();
      normalized = normalized.filter(r => 
        r.parcelId.toLowerCase().includes(q) ||
        r.surveyNo.toLowerCase().includes(q) ||
        r.ownerName.toLowerCase().includes(q) ||
        r.village.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: normalized.length,
      records: normalized
    });
  } catch (err: any) {
    console.error('[LandRecords API] List error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 2. Get Single Land Record by ID or Parcel ID
 * GET /api/land-records/:id
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let record = (await landRecordRepo.findByParcelId(id)) || 
                 (await landRecordRepo.findBySurveyNo(id));

    if (!record) {
      const all = await landRecordRepo.listAll();
      record = all.find(r => r.id === id || r.parcelId === id || r.parcel_id === id);
    }

    if (!record) {
      res.status(404).json({ success: false, error: `Land record '${id}' not found.` });
      return;
    }

    res.json({
      success: true,
      record: normalizeRecord(record)
    });
  } catch (err: any) {
    console.error('[LandRecords API] Get error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 3. Create a New Land Record
 * POST /api/land-records
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      parcelId,
      surveyNo,
      khasraNo,
      khataNo,
      ownerName,
      fatherName,
      area,
      areaUnit = 'Acres',
      landType = 'Agricultural',
      village = 'ABC',
      district = 'XYZ',
      tehsil = 'Sadar',
      status = 'UNDER_REVIEW',
      encumbranceNotes
    } = req.body;

    if (!surveyNo || !ownerName || area === undefined) {
      res.status(400).json({
        success: false,
        error: 'surveyNo, ownerName, and area are required.'
      });
      return;
    }

    const generatedParcelId = parcelId || `LR-${surveyNo.replace(/[^0-9]/g, '') || Math.floor(10000 + Math.random() * 90000)}`;
    const parsedArea = typeof area === 'number' ? area : parseFloat(area) || 1.0;

    const newRecord = {
      id: `rec_${Date.now()}`,
      parcel_id: generatedParcelId,
      parcelId: generatedParcelId,
      survey_no: surveyNo,
      surveyNo,
      khasra_no: khasraNo || surveyNo,
      khasraNo: khasraNo || surveyNo,
      khata_no: khataNo || '00100',
      khataNo: khataNo || '00100',
      district,
      tehsil,
      village,
      area: parsedArea,
      area_unit: areaUnit,
      areaUnit,
      land_type: landType,
      landType,
      owner_name: ownerName,
      ownerName,
      father_name: fatherName || '',
      fatherName: fatherName || '',
      status: (status as LandRecordStatus) || 'UNDER_REVIEW',
      digital_seal_hash: '',
      digitalSealHash: '',
      encumbrance_notes: encumbranceNotes || '',
      last_mutation_date: new Date().toISOString().slice(0, 10),
      last_updated: new Date().toISOString()
    };

    // Update in local records store or database
    const records = await landRecordRepo.listAll();
    const existingIdx = records.findIndex(r => r.parcelId === generatedParcelId || r.parcel_id === generatedParcelId);
    if (existingIdx >= 0) {
      records[existingIdx] = { ...records[existingIdx], ...newRecord };
    } else {
      records.unshift(newRecord);
    }

    const fs = await import('fs');
    const path = await import('path');
    const recordsFile = path.join(process.cwd(), 'server', 'data', 'records.json');
    fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2), 'utf-8');

    // Audit log
    await auditRepo.appendLog({
      record_id: generatedParcelId,
      khasra_no: surveyNo,
      action: 'RECORD_CREATED',
      performed_by: ownerName,
      role: 'CITIZEN',
      ip_address: req.ip || '127.0.0.1',
      details: `Land record ${generatedParcelId} registered for Survey No ${surveyNo} (${parsedArea} ${areaUnit}). Status: ${status}.`
    });

    res.status(201).json({
      success: true,
      record: normalizeRecord(newRecord),
      message: `Land record ${generatedParcelId} created successfully.`
    });
  } catch (err: any) {
    console.error('[LandRecords API] Create error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
