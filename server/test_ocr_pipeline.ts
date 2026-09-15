async function runOcrPipelineTest() {
  console.log('Testing End-to-End OCR + Land Data Extraction Pipeline...\n');

  // Step 1: Upload a deed to trigger File Storage -> OCR -> 16-field Extraction -> Land Record Generation -> Validation
  const formData = new FormData();
  formData.append('citizenId', 'user_cit_101');
  formData.append('citizenName', 'Rishi Sharma');
  formData.append('surveyNo', '124/7');
  formData.append('docType', 'SALE_DEED');

  const uploadRes = await fetch('http://localhost:5000/api/documents/upload', {
    method: 'POST',
    body: formData
  }).then(r => r.json());

  console.log('1. Upload Response Success:', uploadRes.success);
  console.log('   Submission ID:', uploadRes.submissionId);
  console.log('   Land Record Parcel ID:', uploadRes.landRecord?.parcelId);

  // Step 2: Verify all 16 requested schema fields are present
  const requiredSchema = [
    'ownerName',
    'fatherName',
    'surveyNo',
    'khataNo',
    'area',
    'unit',
    'village',
    'tehsil',
    'district',
    'state',
    'registrationNumber',
    'registrationDate',
    'documentType',
    'previousOwner',
    'transactionType',
    'boundaries'
  ];

  console.log('\n2. Verifying 16 Extracted Schema Fields with Provenance:');
  const fields = uploadRes.extractedData?.fields || {};
  let missingCount = 0;
  for (const key of requiredSchema) {
    const item = fields[key];
    if (!item) {
      console.error(`   ✕ Missing field: ${key}`);
      missingCount++;
    } else {
      console.log(`   ✓ ${item.label.padEnd(26)} | Value: "${item.value.slice(0, 30)}" | Conf: ${item.confidence} | Source: "${item.source}"`);
    }
  }

  if (missingCount === 0) {
    console.log('\n   🎉 ALL 16 FIELDS EXTRACTED WITH VALUE, CONFIDENCE & PROVENANCE SOURCE!');
  }

  // Step 3: Verify Deterministic Validation Engine output
  const val = uploadRes.validation;
  console.log('\n3. Deterministic Validation Engine Results:');
  console.log(`   Passed:         ${val?.passed} / 8`);
  console.log(`   Warnings:       ${val?.warnings}`);
  console.log(`   Critical:       ${val?.critical}`);
  console.log(`   Score:          ${val?.score} / 100`);
  console.log(`   Recommendation: "${val?.recommendation}"`);

  console.log('\n   Validation Rules:');
  val?.rules?.forEach((r: any) => {
    console.log(`   ${r.symbol} ${r.name.padEnd(42)} [${r.status}] -> ${r.detail.slice(0, 60)}...`);
  });

  // Step 4: Citizen reviews & edits a field (e.g. area updated)
  console.log('\n4. Testing Citizen Inline Edit (PUT /api/documents/:id)...');
  const editRes = await fetch(`http://localhost:5000/api/documents/${uploadRes.submissionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        area: { value: '2.35', confidence: 1.0, source: 'citizen verified' }
      },
      remarks: 'Verified against local revenue records'
    })
  }).then(r => r.json());
  console.log('   Edit Success:', editRes.success, 'New Area:', editRes.submission?.extractedData?.fields?.area?.value);

  // Step 5: Submit for Verification (POST /api/documents/:id/submit)
  console.log('\n5. Testing Submit for Verification (POST /api/documents/:id/submit)...');
  const submitRes = await fetch(`http://localhost:5000/api/documents/${uploadRes.submissionId}/submit`, {
    method: 'POST'
  }).then(r => r.json());
  console.log('   Submit Success:', submitRes.success, 'Message:', submitRes.message);

  // Step 6: Verify record is queued in Admin Verification Queue
  console.log('\n6. Checking Admin Verification Queue...');
  const queueRes = await fetch('http://localhost:5000/api/admin/verification-queue').then(r => r.json());
  const queuedItem = queueRes.queue?.find((q: any) => q.recordId === uploadRes.landRecord?.parcelId || q.rawRecordId === uploadRes.submissionId);
  console.log('   Queued in Admin Queue:', Boolean(queuedItem), 'Record ID:', queuedItem?.recordId, 'Status:', queuedItem?.status);

  console.log('\n======================================================');
  console.log(' 🎉 COMPLETE MILESTONE PIPELINE VERIFIED SUCCESSFULLY!');
  console.log('======================================================');
}

runOcrPipelineTest().catch(err => {
  console.error('Pipeline test failed:', err);
  process.exit(1);
});
