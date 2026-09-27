import { Router, Request, Response } from 'express';
import { cadastralGisService } from '../services/cadastralGisService';

const router = Router();

/**
 * 1. GET /api/gis/parcels/:khasraNo
 * Lookup a parcel's official GIS polygon and boundary metadata
 */
router.get('/parcels/:khasraNo', (req: Request, res: Response) => {
  try {
    const { khasraNo } = req.params;
    const parcel = cadastralGisService.lookupParcel(decodeURIComponent(khasraNo));

    if (!parcel) {
      res.status(404).json({ success: false, error: `Parcel ${khasraNo} not found in GIS cadastre` });
      return;
    }

    res.json({
      success: true,
      parcel
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 2. POST /api/gis/compare
 * Land Record -> Khasra ID -> GIS Parcel Lookup -> Polygon -> Compare
 * Returns deed vs GIS area, boundary overlap %, and classified spatial discrepancies
 */
router.post('/compare', (req: Request, res: Response) => {
  try {
    const { khasraNo = '124/7', deedArea = 2.35 } = req.body;
    const parsedArea = typeof deedArea === 'number' ? deedArea : parseFloat(String(deedArea).replace(/[^0-9.]/g, '')) || 2.35;

    const result = cadastralGisService.compareDeedAgainstGis(khasraNo, parsedArea);

    res.json({
      success: true,
      comparison: result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 3. GET /api/gis/village-cadastre/:villageId
 * Returns full GeoJSON feature collection for interactive map rendering
 */
router.get('/village-cadastre/:villageId', (req: Request, res: Response) => {
  try {
    const comparison = cadastralGisService.compareDeedAgainstGis('124/7', 2.35);

    const geoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            khasraNo: comparison.khasraNo,
            parcelId: comparison.parcelId,
            areaAcres: comparison.gisAreaAcres,
            layer: 'GIS_MASTER',
            fillColor: '#3b82f6'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [comparison.gisPolygon]
          }
        },
        {
          type: 'Feature',
          properties: {
            khasraNo: comparison.khasraNo,
            areaAcres: comparison.deedAreaAcres,
            layer: 'DEED_CLAIM',
            fillColor: '#10b981'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [comparison.claimPolygon]
          }
        },
        ...comparison.adjacentParcels.map(p => ({
          type: 'Feature',
          properties: {
            khasraNo: p.khasraNo,
            ownerName: p.ownerName,
            areaAcres: p.area,
            layer: 'ADJACENT_PARCEL',
            fillColor: '#64748b'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [p.coordinates]
          }
        }))
      ]
    };

    res.json({
      success: true,
      geoJson,
      comparison
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
