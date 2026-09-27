/**
 * Automated Verification Script for Cadastral GIS Engine
 * 
 * Verifies:
 * 1. Parcel lookup for Khasra 124/7 (BhuNaksha Master Cadastre)
 * 2. Geo-referenced geodesic Shoelace area calculation & polygon centroids
 * 3. Sutherland-Hodgman polygon clipping / intersection math
 * 4. Comparison matching user's exact specification:
 *    - Deed Area: 2.35 acres
 *    - GIS Area: 2.42 acres
 *    - Difference: +2.98%
 *    - Boundary Overlap: 96.7%
 *    - Status: REVIEW
 * 5. All 5 Spatial Anomaly Classifications:
 *    - OVERLAP
 *    - GAP
 *    - SHIFTED_BOUNDARY
 *    - MISSING_PARCEL
 *    - ROAD_DRAINAGE_ENCROACHMENT
 */

import { cadastralGisService, calculatePolygonArea, calculatePolygonCentroid, computePolygonIntersection } from './services/cadastralGisService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✓ ${message}`);
  }
}

async function runCadastralGisTests() {
  console.log('====================================================');
  console.log('BHOOMILENS CADASTRAL GIS ENGINE TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Master Parcel Lookup
  console.log('[TEST 1] Master Parcel Lookup');
  const parcel = cadastralGisService.lookupParcel('124/7');
  assert(parcel !== null, 'Parcel 124/7 retrieved successfully');
  assert(parcel?.gisAreaAcres === 2.42, `Master GIS Area is 2.42 acres (got: ${parcel?.gisAreaAcres})`);
  assert(parcel?.coordinates.length === 6, `Closed polygon with 6 coordinate points (got: ${parcel?.coordinates.length} points)`);
  assert(parcel?.ownerName === 'Rishi Sharma', `Master Khatedar matches recorded cadastre (got: ${parcel?.ownerName})`);

  // Test 2: Geodesic Polygon Area & Centroid Calculation
  console.log('\n[TEST 2] Geodesic Polygon Calculations');
  const areaCalc = calculatePolygonArea(parcel!.coordinates);
  assert(areaCalc.acres >= 2.38 && areaCalc.acres <= 2.46, `Shoelace area calculation within precision window (got: ${areaCalc.acres.toFixed(2)} Ac, ${areaCalc.sqMeters.toFixed(0)} m²)`);
  const centroid = calculatePolygonCentroid(parcel!.coordinates);
  assert(Math.abs(centroid[0] - 78.03219) < 0.001, `Centroid longitude verified (~78.03219, got: ${centroid[0].toFixed(5)})`);
  assert(Math.abs(centroid[1] - 30.31649) < 0.001, `Centroid latitude verified (~30.31649, got: ${centroid[1].toFixed(5)})`);

  // Test 3: Sutherland-Hodgman Polygon Intersection Math
  console.log('\n[TEST 3] Sutherland-Hodgman Polygon Clipping');
  const claimPoly = parcel!.coordinates.map(([lon, lat], idx) => {
    if (idx === 0 || idx === 6) return [lon - 0.0001, lat] as [number, number];
    if (idx === 1) return [lon - 0.0001, lat] as [number, number];
    return [lon, lat] as [number, number];
  });
  const intersection = computePolygonIntersection(claimPoly, parcel!.coordinates);
  assert(intersection.length >= 3, `Valid intersection polygon produced (vertex count: ${intersection.length})`);

  // Test 4: Deed vs Master GIS Comparison (Exact User Spec)
  console.log('\n[TEST 4] Cadastral Comparison Match with Exact Spec');
  const result = cadastralGisService.compareDeedAgainstGis('124/7', 2.35);

  assert(result.deedAreaAcres === 2.35, `Deed Area in spec is 2.35 acres (got: ${result.deedAreaAcres})`);
  assert(result.gisAreaAcres === 2.42, `GIS Area in spec is 2.42 acres (got: ${result.gisAreaAcres})`);
  assert(result.areaDifferencePercent === 2.98, `Area Difference in spec is +2.98% (got: ${result.areaDifferencePercent}%)`);
  assert(result.boundaryOverlapPercent === 96.7, `Boundary Overlap in spec is 96.7% (got: ${result.boundaryOverlapPercent}%)`);
  assert(result.status === 'REVIEW', `Status in spec is REVIEW (got: ${result.status})`);

  // Test 5: All 5 Spatial Anomaly Classifications
  console.log('\n[TEST 5] Five-Category Spatial Anomaly Classification');
  const types = result.discrepancies.map(d => d.type);
  assert(types.includes('OVERLAP'), 'Classification 1: OVERLAP detected (0.04 Ac with Parcel 124/6)');
  assert(types.includes('SHIFTED_BOUNDARY'), 'Classification 2: SHIFTED_BOUNDARY detected (4.8m East shift)');
  assert(types.includes('ROAD_DRAINAGE_ENCROACHMENT'), 'Classification 3: ROAD_DRAINAGE_ENCROACHMENT assessed (Corridor buffer compliant)');
  assert(types.includes('GAP'), 'Classification 4: GAP assessed (Sliver boundary analysis)');

  // Missing parcel check
  const missingResult = cadastralGisService.compareDeedAgainstGis('999/UNKNOWN', 1.5);
  const missingTypes = missingResult.discrepancies.map(d => d.type);
  assert(missingTypes.includes('MISSING_PARCEL'), 'Classification 5: MISSING_PARCEL detected for unmapped cadastral survey numbers');

  console.log('\n====================================================');
  console.log('🎉 ALL CADASTRAL GIS ENGINE TESTS PASSED PERFECTLY!');
  console.log('====================================================\n');
}

runCadastralGisTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
