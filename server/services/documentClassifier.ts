/**
 * BhoomiLens AI Document Classifier
 * Classifies land and revenue documents into 7 core statutory categories:
 * 1. Sale Deed (बैनामा / विक्रय विलेख)
 * 2. Mutation Order (दाखिल खारिज आदेश / नामांतरण)
 * 3. Khatauni / Record of Rights (खतौनी / अधिकार अभिलेख)
 * 4. 7/12 Extract (सात-बारा उतारा)
 * 5. Cadastral Map (भू-नक्शा / शजरा)
 * 6. Registration Certificate (पंजीकरण प्रमाण पत्र / E-Endorsement)
 * 7. Unknown / Mixed Document (अज्ञात / मिश्रित विलेख)
 */

export type DocumentTypeCategory =
  | 'SALE_DEED'
  | 'MUTATION_ORDER'
  | 'KHATAUNI_ROR'
  | 'EXTRACT_7_12'
  | 'CADASTRAL_MAP'
  | 'REGISTRATION_CERTIFICATE'
  | 'UNKNOWN_MIXED';

export type VisualDocumentType =
  | 'SCANNED_LEGACY_PDF'
  | 'HANDWRITTEN_RECORD'
  | 'CADASTRAL_MAP'
  | 'DIGITAL_PDF';

export interface ClassificationSignal {
  pattern: RegExp;
  weight: number;
  label: string;
}

export interface DocumentClassificationResult {
  documentType: DocumentTypeCategory;
  label: string;
  hindiLabel: string;
  confidence: number; // 0.0 to 1.0
  reasoning: string;
  detectedKeywords: string[];
  visualType: VisualDocumentType;
  secondaryType?: DocumentTypeCategory;
  secondaryConfidence?: number;
  features: {
    hasRevenueStamps: boolean;
    hasCourtCaseNumber: boolean;
    hasCadastralBoundaries: boolean;
    hasShareholdingRatios: boolean;
    hasMapCoordinates: boolean;
    hasGrasChallan: boolean;
  };
}

export const documentClassifier = {
  /**
   * Classify an uploaded document using multi-signal linguistic and structural heuristics
   */
  classify(
    rawText: string,
    fileName: string = '',
    mimeType: string = '',
    engineConfidence: number = 95
  ): DocumentClassificationResult {
    const text = (rawText || '').toLowerCase();
    const fname = (fileName || '').toLowerCase();

    // 1. Definition of signal profiles for each document type
    const categoryProfiles: Record<
      Exclude<DocumentTypeCategory, 'UNKNOWN_MIXED'>,
      {
        label: string;
        hindiLabel: string;
        signals: ClassificationSignal[];
        filenameKeywords: string[];
      }
    > = {
      SALE_DEED: {
        label: 'Sale Deed',
        hindiLabel: 'बैनामा / विक्रय विलेख',
        filenameKeywords: ['sale', 'deed', 'conveyance', 'registry', 'bainama', 'bikray'],
        signals: [
          { pattern: /sale\s*deed|conveyance\s*deed|बैनामा|विक्रय\s*पत्र|विलेख/i, weight: 30, label: 'Sale Deed Title' },
          { pattern: /purchaser|buyer|vendee|क्रेता|खरीददार/i, weight: 20, label: 'Purchaser Clause' },
          { pattern: /vendor|seller|विक्रेता|बेचने\s*वाला/i, weight: 20, label: 'Vendor Clause' },
          { pattern: /consideration|rupees|लाख|रुपये|प्रतिफल|विक्रय\s*मूल्य/i, weight: 15, label: 'Financial Consideration' },
          { pattern: /sub-registrar|sro|उप-पंजीयक|पंजीकरण/i, weight: 15, label: 'Sub-Registrar Endorsement' },
          { pattern: /absolute\s*sale|conveyed\s*absolutely|हस्तांतरित/i, weight: 15, label: 'Absolute Conveyance Covenant' },
          { pattern: /four\s*boundaries|चौहद्दी|north.*south.*east.*west/i, weight: 15, label: 'Cadastral Boundaries' },
          { pattern: /possession.*handed\s*over|कब्जा.*दिलाया/i, weight: 10, label: 'Possession Covenant' },
          { pattern: /stamp\s*duty|gras\s*challan|स्टाम्प\s*शुल्क/i, weight: 10, label: 'Stamp Duty Payment' },
        ]
      },

      MUTATION_ORDER: {
        label: 'Mutation Order',
        hindiLabel: 'दाखिल खारिज आदेश / नामांतरण',
        filenameKeywords: ['mutation', 'dakhil', 'kharij', 'namantaran', 'order'],
        signals: [
          { pattern: /mutation\s*order|dakhil\s*kharij|दाखिल\s*खारिज|नामांतरण\s*आदेश|नामांतरण/i, weight: 35, label: 'Mutation Order Header' },
          { pattern: /court\s*of\s*tehsildar|तहसीलदार\s*न्यायालय|नायब\s*तहसीलदार/i, weight: 25, label: 'Revenue Court Jurisprudence' },
          { pattern: /case\s*no|वाद\s*संख्या|मुकदमा\s*नंबर|miscellaneous\s*case/i, weight: 20, label: 'Revenue Case Number' },
          { pattern: /section\s*34|section\s*35|धारा\s*34|धारा\s*35|land\s*revenue\s*act/i, weight: 20, label: 'Section 34 Statutory Reference' },
          { pattern: /order\s*sheet|आदेशानुसार|आदेश\s*किया\s*जाता\s*है|अतएव\s*आदेश/i, weight: 20, label: 'Magisterial Order Pronouncement' },
          { pattern: /pre-mutation|previous\s*owner\s*name\s*deleted|नाम\s*काटकर/i, weight: 15, label: 'Deletion of Predecessor' },
          { pattern: /transferee|name\s*substituted|नाम\s*दर्ज\s*किया\s*जावे|अंकित\s*हो/i, weight: 15, label: 'Substitution of Transferee' },
          { pattern: /parwana|pargana|परगना|तहसील/i, weight: 10, label: 'Administrative Pargana Seal' },
        ]
      },

      KHATAUNI_ROR: {
        label: 'Khatauni / Record of Rights',
        hindiLabel: 'खतौनी / अधिकार अभिलेख',
        filenameKeywords: ['khatauni', 'ror', 'jamabandi', 'fasli', 'record_of_rights'],
        signals: [
          { pattern: /khatauni|खतौनी|record\s*of\s*rights|अधिकार\s*अभिलेख/i, weight: 35, label: 'Khatauni ROR Header' },
          { pattern: /fasli\s*year|फसली\s*वर्ष|फसली/i, weight: 25, label: 'Fasli Agricultural Calendar' },
          { pattern: /khata\s*(?:no|number)|खाता\s*संख्या|खाता\s*नं/i, weight: 20, label: 'Khata Account Identifier' },
          { pattern: /khatedar|खातेदार\s*का\s*नाम|काश्तकार/i, weight: 20, label: 'Recorded Khatedar Registry' },
          { pattern: /bhumi\s*rajaswa|lagan|भू-राजस्व|लगान|मालगुजारी/i, weight: 15, label: 'Annual Land Revenue Cess' },
          { pattern: /share|अंश|भाग|1\/2|1\/3|1\/4/i, weight: 15, label: 'Tenancy Share Ratio' },
          { pattern: /sankramaniya|bhumidhar|संक्रमणीय\s*भूमिधर|असंक्रमणीय/i, weight: 15, label: 'Statutory Land Tenure Class' },
          { pattern: /jamabandi|जमाबंदी|खेवट/i, weight: 15, label: 'Jamabandi Cadastral Register' },
        ]
      },

      EXTRACT_7_12: {
        label: '7/12 Extract',
        hindiLabel: 'सात-बारा उतारा / गाव नमुना',
        filenameKeywords: ['7_12', '7-12', 'satbara', 'saat_baara', 'pahani', 'village_form_7'],
        signals: [
          { pattern: /7\s*\/\s*12|सात\s*[-–\s]?बारा|गाव\s*नमुना\s*7|village\s*form\s*vii/i, weight: 35, label: 'Village Form VII/XII Title' },
          { pattern: /village\s*form\s*xii|गाव\s*नमुना\s*12|पिकांची\s*नोंदणी|crop\s*inspection/i, weight: 25, label: 'Pahani Crop Cultivation Log' },
          { pattern: /kulkshetra|total\s*area|एकूण\s*क्षेत्र|क्षेत्रफळ/i, weight: 20, label: 'Kulkshetra Metric Ledger' },
          { pattern: /potkharaba|uncultivable|पोटखराबा/i, weight: 20, label: 'Potkharaba Uncultivable Area' },
          { pattern: /hakk\s*va\s*itar|हक्क\s*व\s*इतर\s*अधिकार|other\s*rights/i, weight: 20, label: 'Rights and Encumbrances Column' },
          { pattern: /khate\s*kramank|खाते\s*क्रमांक|हिस\s*नं|hissa\s*no/i, weight: 15, label: 'Hissa/Subdivision Registry' },
          { pattern: /bhogvatadar|कब्जेदार|भोगवटादार/i, weight: 15, label: 'Bhogvatadar Landholder Class' },
        ]
      },

      CADASTRAL_MAP: {
        label: 'Cadastral Map',
        hindiLabel: 'भू-नक्शा / शजरा नक्शा',
        filenameKeywords: ['map', 'naksha', 'shajra', 'bhunaksha', 'cadastral', 'polygon'],
        signals: [
          { pattern: /cadastral\s*map|भू\s*[-–\s]?नक्शा|शजरा\s*नक्शा|शजरा|village\s*map/i, weight: 35, label: 'Cadastral Map Nomenclature' },
          { pattern: /scale\s*1\s*:\s*[0-9]+|पैमाना\s*1\s*:\s*[0-9]+|1\s*:\s*4000/i, weight: 25, label: 'Cartographic Engineering Scale' },
          { pattern: /north\s*arrow|उत्तर\s*दिशा|north\s*demarcation/i, weight: 20, label: 'Geodetic North Orientation' },
          { pattern: /adjacent\s*parcel|surrounding\s*khasra|समीपवर्ती\s*खसरा|चक\s*रोड/i, weight: 20, label: 'Adjacent Khasra Demarcations' },
          { pattern: /polygon|coordinates|latitude|longitude|lat.*long|georeferenced/i, weight: 20, label: 'GIS Coordinate Georeferencing' },
          { pattern: /boundary\s*demarcation|सीमांकन|मेड़|field\s*boundary/i, weight: 15, label: 'Physical Ridge Demarcation' },
        ]
      },

      REGISTRATION_CERTIFICATE: {
        label: 'Registration Certificate',
        hindiLabel: 'पंजीकरण प्रमाण पत्र / E-Endorsement',
        filenameKeywords: ['certificate', 'endorsement', 'receipt', 'gras', 'challan', 'pramapatra'],
        signals: [
          { pattern: /registration\s*certificate|पंजीकरण\s*प्रमाण\s*पत्र|e-registration\s*certificate/i, weight: 35, label: 'Statutory Registration Certificate Title' },
          { pattern: /gras\s*challan|e-challan|ग्रास\s*चालान|चालान\s*संख्या/i, weight: 25, label: 'GRAS E-Treasury Challan Seal' },
          { pattern: /sro\s*endorsement|sub-registrar\s*endorsement|पंजीयन\s*पुष्टि/i, weight: 20, label: 'Sub-Registrar Endorsement Stamp' },
          { pattern: /volume\s*(?:no)?|book\s*(?:no)?\s*1|जिल्द\s*संख्या/i, weight: 20, label: 'Archival Ledger Volume & Book' },
          { pattern: /biometric\s*(?:token|verified)|बायोमेट्रिक\s*प्रमाणीकरण/i, weight: 15, label: 'UIDAI Biometric SRO Token' },
          { pattern: /registration\s*fee\s*receipt|फीस\s*रसीद|पंजीयन\s*शुल्क/i, weight: 15, label: 'Statutory Registration Fee Receipt' },
        ]
      }
    };

    // 2. Score each category
    const scores: Record<Exclude<DocumentTypeCategory, 'UNKNOWN_MIXED'>, { score: number; hits: string[] }> = {
      SALE_DEED: { score: 0, hits: [] },
      MUTATION_ORDER: { score: 0, hits: [] },
      KHATAUNI_ROR: { score: 0, hits: [] },
      EXTRACT_7_12: { score: 0, hits: [] },
      CADASTRAL_MAP: { score: 0, hits: [] },
      REGISTRATION_CERTIFICATE: { score: 0, hits: [] },
    };

    for (const [catKey, profile] of Object.entries(categoryProfiles) as [Exclude<DocumentTypeCategory, 'UNKNOWN_MIXED'>, typeof categoryProfiles[keyof typeof categoryProfiles]][]) {
      // Filename cues bonus (+15)
      for (const kw of profile.filenameKeywords) {
        if (fname.includes(kw)) {
          scores[catKey].score += 15;
          scores[catKey].hits.push(`File name keyword: "${kw}"`);
          break;
        }
      }

      // Signal patterns evaluation
      for (const signal of profile.signals) {
        if (signal.pattern.test(text)) {
          scores[catKey].score += signal.weight;
          scores[catKey].hits.push(signal.label);
        }
      }
    }

    // 3. Special Cadastral Map heuristic:
    // If text density is low (< 250 words) and contains numbers, coordinates, and image mime type, boost Cadastral Map
    const wordCount = (rawText.match(/\S+/g) || []).length;
    if (wordCount < 120 && (mimeType.startsWith('image/') || fname.endsWith('.png') || fname.endsWith('.jpg'))) {
      if (/map|naksha|plot|shajra|boundary|\d+\/\d+/i.test(text) || /map|naksha|plot|shajra/i.test(fname)) {
        scores.CADASTRAL_MAP.score += 45;
        scores.CADASTRAL_MAP.hits.push('Low text-density visual spatial layout');
      }
    }

    // 4. Rank categories
    const sorted = (Object.keys(scores) as Exclude<DocumentTypeCategory, 'UNKNOWN_MIXED'>[]).sort(
      (a, b) => scores[b].score - scores[a].score
    );

    const bestCategory = sorted[0];
    const bestScore = scores[bestCategory].score;
    const runnerUpCategory = sorted[1];
    const runnerUpScore = scores[runnerUpCategory].score;

    // 5. Determine Document Visual Type
    let visualType: VisualDocumentType = 'DIGITAL_PDF';
    if (bestCategory === 'CADASTRAL_MAP' || /map|naksha|polygon|shajra/i.test(fname)) {
      visualType = 'CADASTRAL_MAP';
    } else if (
      /हस्तलिखित|manuscript|handwritten/i.test(text) ||
      (engineConfidence < 70 && wordCount > 30)
    ) {
      visualType = 'HANDWRITTEN_RECORD';
    } else if (
      engineConfidence < 92 ||
      /scan|scanned|photocopy|zerox/i.test(text) ||
      /scan|scanned|img|cam/i.test(fname) ||
      mimeType.startsWith('image/')
    ) {
      visualType = 'SCANNED_LEGACY_PDF';
    }

    // 6. Thresholding for Unknown / Mixed
    if (bestScore < 25) {
      return {
        documentType: 'UNKNOWN_MIXED',
        label: 'Unknown / Mixed Document',
        hindiLabel: 'अज्ञात / मिश्रित विलेख',
        confidence: Math.max(0.40, Math.min(0.65, engineConfidence / 100)),
        reasoning:
          'Insufficient statutory clauses matched. The document appears to be an unindexed deed extract, miscellaneous affidavit, or multi-deed bundle requiring manual review.',
        detectedKeywords: scores[bestCategory].hits,
        visualType,
        features: {
          hasRevenueStamps: /stamp|challan|मुद्रांक/i.test(text),
          hasCourtCaseNumber: /case\s*no|वाद\s*संख्या/i.test(text),
          hasCadastralBoundaries: /boundary|चौहद्दी|north.*south/i.test(text),
          hasShareholdingRatios: /share|अंश|1\/[0-9]/i.test(text),
          hasMapCoordinates: /scale|lat|long|polygon/i.test(text),
          hasGrasChallan: /gras|e-challan/i.test(text),
        }
      };
    }

    // Normalized confidence computation (caps at 0.99)
    const normalizedConfidence = Math.min(
      0.99,
      Math.max(0.82, (bestScore / (bestScore + 18)) * (engineConfidence / 100))
    );

    const profile = categoryProfiles[bestCategory];

    // Generate clear, explainable reasoning
    const hitSummary = scores[bestCategory].hits.slice(0, 3).join(', ');
    const reasoning = `Classified as ${profile.label} (${profile.hindiLabel}) with ${Math.round(
      normalizedConfidence * 100
    )}% confidence based on identified key statutory indicators: ${hitSummary}.`;

    return {
      documentType: bestCategory,
      label: profile.label,
      hindiLabel: profile.hindiLabel,
      confidence: parseFloat(normalizedConfidence.toFixed(2)),
      reasoning,
      detectedKeywords: scores[bestCategory].hits,
      visualType,
      secondaryType: runnerUpScore > 20 ? runnerUpCategory : undefined,
      secondaryConfidence:
        runnerUpScore > 20
          ? parseFloat(Math.min(0.85, (runnerUpScore / (bestScore + runnerUpScore))).toFixed(2))
          : undefined,
      features: {
        hasRevenueStamps: /stamp|challan|मुद्रांक/i.test(text),
        hasCourtCaseNumber: /court|case\s*no|वाद\s*संख्या|tehsildar/i.test(text),
        hasCadastralBoundaries: /boundary|चौहद्दी|north.*south|पूर्व.*पश्चिम/i.test(text),
        hasShareholdingRatios: /share|अंश|1\/[0-9]/i.test(text),
        hasMapCoordinates: /scale|1:4000|lat|long|polygon|north\s*arrow/i.test(text),
        hasGrasChallan: /gras|e-challan|challan/i.test(text),
      }
    };
  }
};
