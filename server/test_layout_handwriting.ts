import { layoutSegmentationService } from './services/layoutSegmentationService';
import { extractionService } from './services/extractionService';
import { validationEngine } from './services/validationEngine';

async function testLayoutAndHandwritingSystem() {
  console.log('======================================================================');
  console.log('  BHOOMILENS MULTI-MODAL LAYOUT SEGMENTATION & HANDWRITING OCR TEST');
  console.log('======================================================================\n');

  const sampleDeedText = `
    GOVERNMENT OF UTTARAKHAND / REGISTRATION AND STAMP DEPARTMENT
    SUB-REGISTRAR OFFICE, SADAR TEHSIL, DEHRADUN
    CERTIFIED REGISTERED SALE DEED (बैनामा)
    Book No. 1, Vol. 4182, Pages 110-128
    Doc No: UK-XYZ-2019-REG-04821

    VENDOR: Sri Ram Gopal Sharma, S/o Late Radhey Shyam Sharma
    PURCHASER: Sri Rishi Sharma, S/o Late Bipin Chandra Sharma
    Khasra No: 124/7, Khata No: 0042, Village ABC, Tehsil Sadar, District XYZ
    Original Recorded Area: 2.35 Acres
    
    ✍ दुरुस्त रकबा: Area = 2.35 → 2.42 Acres (संशोधित व प्रमाणित तहसीलदार सदर)
    Official Seal of Revenue Court, Tehsildar Sadar Affixed.

    Consideration Paid: ₹ 42,50,000/-
    Stamp Duty GRAS Challan: UK-GRAS-2019-CH-994101 (₹ 2,97,500 Paid)
  `;

  // 1. Run Multi-modal Layout Segmentation
  console.log('[1] Executing Layout Segmentation Engine...');
  const layout = layoutSegmentationService.analyzeDocument(sampleDeedText, 'SALE_DEED', [
    { pageNumber: 1, text: sampleDeedText },
    { pageNumber: 2, text: sampleDeedText }
  ]);

  console.log(`  Engine:               ${layout.engine}`);
  console.log(`  Total Regions:        ${layout.regions.length}`);
  console.log(`  - Printed Text:       ${layout.summary.printedTextCount} blocks`);
  console.log(`  - Handwritten Ink:    ${layout.summary.handwrittenCount} annotations`);
  console.log(`  - Statutory Seals:    ${layout.summary.stampSealCount} authentic stamps`);
  console.log(`  - Tabular Forms:      ${layout.summary.tableFormCount} parcel schedules`);
  console.log(`  - Tampering Risk:     ${layout.summary.tamperingRiskLevel}`);

  if (layout.regions.length >= 4) {
    console.log('  -> Multi-modal Region Detection: PASS ✓\n');
  } else {
    console.error('  -> Multi-modal Region Detection: FAIL ✗\n');
    process.exit(1);
  }

  // 2. Validate Handwritten Alteration & Correction Engine
  console.log('[2] Evaluating Real-World Handwritten Correction ("Area = 2.35 → 2.42")...');
  const areaCorrection = layout.handwrittenAnnotations.find(a => a.targetField === 'area');

  if (!areaCorrection) {
    console.error('  -> Area Correction Detection: FAIL ✗ (Missing expected handwritten area amendment)');
    process.exit(1);
  }

  console.log(`  Detected Annotation:  "${areaCorrection.rawText}"`);
  console.log(`  Intent:               ${areaCorrection.intent}`);
  console.log(`  Original Printed:     ${areaCorrection.originalPrintedValue} Acres`);
  console.log(`  Handwritten Override: ${areaCorrection.handwrittenOverrideValue} Acres`);
  console.log(`  Counter-Signed:       ${areaCorrection.isCounterSigned ? 'YES ✓' : 'NO ✗'}`);
  console.log(`  Endorsing Authority:  ${areaCorrection.endorsingAuthority}`);
  console.log(`  Risk Assessment:      ${areaCorrection.riskAssessment}`);
  console.log(`  Rationale:            ${areaCorrection.explanation}`);

  if (
    areaCorrection.intent === 'CORRECTION_OVERRIDE' &&
    areaCorrection.originalPrintedValue === '2.35' &&
    areaCorrection.handwrittenOverrideValue === '2.42' &&
    areaCorrection.isCounterSigned
  ) {
    console.log('  -> Handwritten Correction & Stroke Analysis: PASS ✓\n');
  } else {
    console.error('  -> Handwritten Correction & Stroke Analysis: FAIL ✗\n');
    process.exit(1);
  }

  // 3. Run Extraction Service with Layout Integration
  console.log('[3] Running Extraction Pipeline with Integrated Layout Analysis...');
  const extracted = extractionService.extractLandFields(sampleDeedText, 'BhoomiLens-VisionOCR', 96);

  console.log(`  Extracted Area:       ${extracted.fields.area.value} ${extracted.fields.unit.value}`);
  console.log(`  Handwritten Override: ${extracted.fields.area.isHandwrittenOverride ? 'YES (' + extracted.fields.area.handwrittenOverrideValue + ')' : 'NO'}`);
  console.log(`  Layout Attached:      ${extracted.layoutAnalysis ? 'YES ✓' : 'NO ✗'}`);

  if (extracted.fields.area.isHandwrittenOverride && extracted.layoutAnalysis) {
    console.log('  -> Extraction Layout Coupling: PASS ✓\n');
  } else {
    console.error('  -> Extraction Layout Coupling: FAIL ✗\n');
    process.exit(1);
  }

  // 4. Run Deterministic Validation Engine (Rule 9 Check)
  console.log('[4] Running Validation Engine with Rule 9 (Handwritten Alteration Check)...');
  const validation = validationEngine.validateRecord(extracted, undefined, []);

  const rule9 = validation.rules.find(r => r.id === 'rule_handwritten_alteration');
  if (!rule9) {
    console.error('  -> Rule 9 Check: FAIL ✗ (Missing Rule 9)');
    process.exit(1);
  }

  console.log(`  Rule 9 Name:          ${rule9.name}`);
  console.log(`  Rule 9 Status:        ${rule9.status} (${rule9.score}%)`);
  console.log(`  Rule 9 Detail:        ${rule9.detail}`);
  console.log(`  Overall Score:        ${validation.score}/100`);
  console.log(`  Rules Passed:         ${validation.passed} / ${validation.rules.length}`);

  if (rule9.status === 'PASS' && validation.score >= 80) {
    console.log('  -> Rule 9 Handwritten Verification: PASS ✓\n');
  } else {
    console.error('  -> Rule 9 Handwritten Verification: FAIL ✗\n');
    process.exit(1);
  }

  console.log('======================================================================');
  console.log('  ALL MULTI-MODAL LAYOUT & HANDWRITING TESTS COMPLETED SUCCESSFULLY (100%)');
  console.log('======================================================================');
}

testLayoutAndHandwritingSystem().catch(e => {
  console.error('Test failed:', e);
  process.exit(1);
});
