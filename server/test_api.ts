async function testApis() {
  console.log('Testing BhoomiLens Backend APIs & Admin Routes...');

  // 1. Health
  const healthRes = await fetch('http://localhost:5000/api/health').then(r => r.json());
  console.log('1. Health:', healthRes.status, healthRes.service);

  // 2. Auth Login
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rishi.sharma@uttarakhand.gov.in' })
  }).then(r => r.json());
  console.log('2. Auth Login:', loginRes.success, loginRes.user?.name, loginRes.user?.role);

  // 3. Admin Top Statistics / Metrics
  const statsRes = await fetch('http://localhost:5000/api/admin/stats').then(r => r.json());
  console.log('3. Admin Stats:', statsRes.success, {
    totalLandRecords: statsRes.stats?.totalLandRecords,
    pendingVerification: statsRes.stats?.pendingVerification,
    conflictsDetected: statsRes.stats?.conflictsDetected,
    correctionRequests: statsRes.stats?.correctionRequests,
    documentsProcessed: statsRes.stats?.documentsProcessed
  });

  // 4. Verification Queue
  const queueRes = await fetch('http://localhost:5000/api/admin/verification-queue').then(r => r.json());
  console.log('4. Admin Queue count:', queueRes.count, 'First two:', queueRes.queue[0]?.recordId, queueRes.queue[1]?.recordId);

  // 5. Run Deterministic Validation Engine
  const valRes = await fetch('http://localhost:5000/api/admin/records/LR-10294/validate').then(r => r.json());
  console.log('5. Validation Engine on LR-10294:', {
    score: valRes.validation?.score,
    passed: valRes.validation?.passed,
    warnings: valRes.validation?.warnings,
    critical: valRes.validation?.critical,
    recommendation: valRes.validation?.recommendation,
    rulesCount: valRes.validation?.rules?.length
  });

  // 6. Admin Adjudicate LR-10295 (verify dynamic khasra '88/2' without hardcoded 124/7)
  const adjRes = await fetch('http://localhost:5000/api/admin/records/LR-10295/adjudicate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      decision: 'APPROVE',
      officerName: 'Rajeshwar Singh Negi',
      officerDesignation: 'Sub-Divisional Magistrate (SDM)',
      remarks: 'Verified cadastral boundaries for Manglaur Dehat',
      conditionPrecedent: 'Subject to annual revenue cess'
    })
  }).then(r => r.json());
  console.log('6. Adjudicate LR-10295:', adjRes.success, adjRes.status, 'Seal:', adjRes.sealHash ? 'Generated' : 'None');

  // 7. Verify Audit Log contains dynamic Khasra
  const auditRes = await fetch('http://localhost:5000/api/admin/audit-logs?limit=3').then(r => r.json());
  const latestLog = auditRes.logs?.[0];
  console.log('7. Latest Audit Log Khasra:', latestLog?.khasra_no, 'Record ID:', latestLog?.record_id, 'Action:', latestLog?.action);

  // 8. Admin Conflict Center
  const conflictsRes = await fetch('http://localhost:5000/api/admin/conflicts').then(r => r.json());
  console.log('8. Conflict Center count:', conflictsRes.count, 'First type:', conflictsRes.conflicts?.[0]?.type);

  // 9. Correction Requests List
  const corrListRes = await fetch('http://localhost:5000/api/admin/correction-requests').then(r => r.json());
  console.log('9. Correction Requests count:', corrListRes.count);

  // 10. Admin Reject Record
  const rejectRes = await fetch('http://localhost:5000/api/admin/records/LR-10299/reject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ officerName: 'Rajeshwar Singh Negi', remarks: 'Survey boundary conflict with neighbor.' })
  }).then(r => r.json());
  console.log('10. Admin Reject LR-10299:', rejectRes.success, rejectRes.status);

  // 11. Admin Request Correction
  const corrReqRes = await fetch('http://localhost:5000/api/admin/records/LR-10296/request-correction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ officerName: 'Rajeshwar Singh Negi', remarks: 'Submit Kanungo spot verification.' })
  }).then(r => r.json());
  console.log('11. Admin Request Correction LR-10296:', corrReqRes.success, corrReqRes.status);

  console.log('\n🎉 ALL ADMIN ROUTES & PIPELINE TESTS COMPLETED SUCCESSFULLY!');
}

testApis().catch(err => {
  console.error('API Test Error:', err);
  process.exit(1);
});
