import { documentClassifier } from './services/documentClassifier';
import { extractionService } from './services/extractionService';

const TEST_CORPUS = [
  {
    expected: 'SALE_DEED',
    fileName: 'Registry_Sadar_Dehradun.pdf',
    text: `
      GOVERNMENT OF UTTARAKHAND
      REGISTRATION AND STAMP DEPARTMENT
      CERTIFIED COPY OF REGISTERED SALE DEED (बैनामा / विक्रय विलेख)
      This INDENTURE OF ABSOLUTE SALE CONVEYANCE made on 14th August 2019
      Between: Sri Ram Gopal Sharma (Vendor / विक्रेता)
      And: Sri Rishi Sharma (Purchaser / क्रेता)
      Subject Property: Khasra No. 124/7, Khata No. 0042, Village ABC, Tehsil Sadar, District XYZ
      Area: 2.35 Acres (दो दशमलव पैंतीस एकड़)
      Consideration Amount: Rs. 42,50,000/- (मुबलिग बयालीस लाख पचास हजार रुपये)
      Stamp Duty Paid: Rs. 2,97,500/- under Article 23 Schedule 1-B.
      Possession: Absolute vacant peaceful proprietary possession delivered to vendee.
      Boundaries:
      North: Plot 124/6
      South: State Irrigation Canal
      East: Link Road 12m
      West: Khasra 124/8
    `
  },
  {
    expected: 'MUTATION_ORDER',
    fileName: 'Dakhil_Kharij_Order_Case_418.pdf',
    text: `
      न्यायालय तहसीलदार / सहायक कलेक्टर प्रथम श्रेणी, परगना व तहसील सदर
      वाद संख्या: 2024/REV/MUT/0418 धारा 34/35 भू-राजस्व अधिनियम (Land Revenue Act)
      दाखिल खारिज / नामांतरण आदेश (Mutation Order)
      ग्राम: ए.बी.सी., परगना: केन्द्रीय, जिला: एक्स.वाई.जेड
      कौम व नाम आवेदक: ऋषि शर्मा सुपुत्र स्व० बिपिन चन्द्र शर्मा
      बनाम: स्व० केदारनाथ शर्मा (मृतक खातेदार)
      आदेश:
      पत्रावली प्रस्तुत हुई। हल्का लेखपाल व कानूनगो की आख्या प्राप्त हुई। नियमानुसार उद्घोषणा (इश्तेहार) निर्गत की गई। कोई आपत्ति प्राप्त नहीं हुई।
      अतः आदेश दिया जाता है कि मौजा ए.बी.सी. के खाता संख्या 0042, खसरा संख्या 124/7, रकबा 2.35 एकड़ से मृतक का नाम खारिज होकर
      आवेदक ऋषि शर्मा का नाम बतौर वारिस संक्रमणीय भूमिधर दर्ज हो। परवाना अमलदरामद जारी हो।
      दिनांक: 18/01/2024
      हस्ताक्षर: तहसीलदार (मुहर न्यायालय)
    `
  },
  {
    expected: 'KHATAUNI_ROR',
    fileName: 'Nakal_Khatauni_Fasli_1430.pdf',
    text: `
      राजस्व परिषद, उत्तर प्रदेश / उत्तराखण्ड भूलेख पोर्टल
      उद्धरण खतौनी (अधिकार अभिलेख / Record of Rights)
      फसली वर्ष: 1430-1435 Fasli
      ग्राम का नाम: ए.बी.सी., परगना: केन्द्रीय, तहसील: सदर, जनपद: एक्स.वाई.जेड
      भाग 1: खातेदार का नाम: ऋषि शर्मा आत्मज बिपिन चन्द्र शर्मा, निवास: ग्राम ए.बी.सी.
      खाता संख्या: 0042
      भू-धृति श्रेणी: 1-क (संक्रमणीय भूमिधरों के अधिकार वाली भूमि)
      खसरा संख्या: 124/7
      क्षेत्रफल: 2.3500 हेक्टेयर / एकड़
      मालगुजारी / देय लगान: रु० 48.50 वार्षिक
      परिवर्तन संबंधी आदेश (कॉलम 7-12): आदेशानुसार तहसीलदार सदर पत्रांक 418/2024 नाम दर्ज हुआ।
    `
  },
  {
    expected: 'EXTRACT_7_12',
    fileName: 'Sat_Bara_Utara_Form_7_12.pdf',
    text: `
      MAHARASHTRA / GOA LAND REVENUE CODE
      VILLAGE FORM VII-XII (गाव नमुना ७/१२ उतारा)
      Village: ABC, Taluka: Central, District: XYZ
      Survey No / Gat No: 124, Hissa No: 7
      Bhobhogwada Type: Occupant Class 1 (भोगवटादार वर्ग १)
      Cultivable Area: 2 Hectares 35 Ares, Potkharaba (Uncultivable): 0.12 Ares
      Khatedar Name: Rishi Sharma s/o Bipin Chandra Sharma
      Form XII - Crop Details (पिकांची नोंद वही):
      Season: Kharif / Rabi, Crop: Wheat & Paddy, Irrigated Area: 2.00 Ha
      Source of Irrigation: Well / Canal
      Other Rights & Encumbrances: No government dues pending.
    `
  },
  {
    expected: 'CADASTRAL_MAP',
    fileName: 'Shajra_Cadastral_Sheet_14.png',
    text: `
      REVENUE SURVEY DEPARTMENT
      CADASTRAL VILLAGE MAP (शजरा / भू-नक्शा)
      Village: ABC, Sheet No: 14, Cluster: North
      Scale: 1:4000 (Metric Cadastre)
      Cartographic Legend:
      Parcel Boundary lines: Khasra 124/7 highlighted.
      Ghat / Boundary Stones marked with GCP coordinates (Lat: 30.31649, Long: 78.03219).
      Adjacent Parcels:
      North: Parcel 124/6
      South: Rajwaha / Canal
      East: Chak Road 12m
      West: Parcel 124/8
      Geo-referencing: Aligned with BhuNaksha GIS Vector Grid.
    `
  },
  {
    expected: 'REGISTRATION_CERTIFICATE',
    fileName: 'SubRegistrar_Endorsement_Certificate.pdf',
    text: `
      GOVERNMENT REGISTRATION AND STAMPS DEPARTMENT
      MEMORANDUM OF REGISTRATION / E-ENDORSEMENT CERTIFICATE (पंजीकरण प्रमाण पत्र)
      Under Section 60 of the Indian Registration Act, 1908
      Document Registration Number: UK-XYZ-2019-REG-04821
      Book No: 1, Volume No: 4182, Page Numbers: 110 to 128
      Registered at Office of Sub-Registrar Sadar on 14/08/2019
      Presented by: Rishi Sharma
      Stamp Duty e-Challan: GRAS-UK-2019-98124018 for Rs. 2,97,500/-
      Registration Fee Paid: Rs. 42,500/-
      Biometric Thumb Impression & Iris Scan captured and authenticated.
      Digital Signature of Sub-Registrar: Valid.
    `
  },
  {
    expected: 'UNKNOWN_MIXED',
    fileName: 'General_Letter_Informal.txt',
    text: `
      Dear Sir,
      Please find attached the informal family discussion notes regarding mutual understanding and fence repair
      near the garden. No legal execution has taken place yet.
    `
  }
];

async function runClassifierTestSuite() {
  console.log('======================================================================');
  console.log('  BHOOMILENS AI DOCUMENT-TYPE CLASSIFIER & ROUTING PIPELINE TEST');
  console.log('======================================================================\n');

  let passedTests = 0;

  for (const testCase of TEST_CORPUS) {
    console.log(`[TEST] Classifying: "${testCase.fileName}"`);
    
    // 1. Run Classifier
    const classification = documentClassifier.classify(testCase.text, testCase.fileName);
    const isClassMatch = classification.documentType === testCase.expected;

    console.log(`  -> Detected Category: ${classification.documentType} (${classification.label})`);
    console.log(`  -> Hindi Title:       ${classification.hindiLabel}`);
    console.log(`  -> Visual Morphology: ${classification.visualType}`);
    console.log(`  -> Confidence:        ${(classification.confidence * 100).toFixed(1)}%`);
    console.log(`  -> AI Reasoning:      ${classification.reasoning}`);
    console.log(`  -> Keywords:          ${classification.detectedKeywords.slice(0, 4).join(', ')}`);

    // 2. Run Routed Extraction Pipeline
    const extractedData = extractionService.extractLandFields(
      testCase.text,
      'INDIC_VISION_V2',
      96,
      [],
      testCase.fileName
    );

    const hasSpecialized = extractedData.specializedData && Object.keys(extractedData.specializedData).length > 0;
    console.log(`  -> Specialized Pipeline: ${hasSpecialized ? 'DISPATCHED ✓' : 'NONE'}`);
    if (hasSpecialized) {
      console.log(`     Specialized Keys: ${Object.keys(extractedData.specializedData!).join(', ')}`);
    }

    if (isClassMatch) {
      console.log(`  -> Result: PASS ✓\n`);
      passedTests++;
    } else {
      console.error(`  -> Result: FAIL ✗ (Expected: ${testCase.expected}, Got: ${classification.documentType})\n`);
    }
  }

  console.log('======================================================================');
  console.log(`  RESULTS: ${passedTests} / ${TEST_CORPUS.length} TESTS PASSED (${((passedTests / TEST_CORPUS.length) * 100).toFixed(0)}%)`);
  console.log('======================================================================');

  if (passedTests === TEST_CORPUS.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runClassifierTestSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
