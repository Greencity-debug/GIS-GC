'use client';

import { useEffect, useRef, useState } from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-draw';
import { getPolygonColor } from '@/app/lib/utils';
import { turfArea } from '@turf/area';

type Polygon = {
  id: string;
  name: string;
  coordinates: any;
  last_mow_date: string;
  layer_id: string;
};

type Props = {
  polygons: Polygon[];
};

export default function MapContainer({ polygons }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [activeLayer, setActiveLayer] = useState<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map('map-wrap', {
      center: [55.2281, 52.3175],
      zoom: 13,
      zoomControl: false,
    });
    mapRef.current = map;

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    });
    const hybridLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    L.control.layers({
      'Схема': osmLayer,
      'Спутник': satelliteLayer,
      'Гибрид': hybridLayer,
    }).addTo(map);

    drawnItemsRef.current = new L.FeatureGroup().addTo(map);
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItemsRef.current
      },
      draw: {
        polygon: {
          showArea: true
        }
      }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawnItemsRef.current?.addLayer(layer);

      const geojson = layer.toGeoJSON();
      const area = turfArea(geojson);
      console.log('Polygon created with area:', area, 'and coords:', geojson.geometry.coordinates);
    });

    drawnItemsRef.current.on('click', (e: any) => {
      const layer = e.layer;
      const polygonId = layer.options.id;
      L.popup()
        .setLatLng(layer.getBounds().getCenter())
        .setContent(`
          <div class="p-2">
            <strong>Название:</strong> ${layer.options.name || 'Не указано'}<br/>
            <strong>Площадь:</strong> ${layer.options.area.toFixed(2)} м²<br/>
            <strong>Дата покоса:</strong> ${layer.options.last_mow_date}<br/>
            <button class="bg-primary text-white p-1 rounded mt-2" onclick="handleMow('${polygonId}')">Косить</button>
            <button class="bg-gray-500 text-white p-1 rounded mt-2 ml-2" onclick="handleEdit('${polygonId}')">Редактировать</button>
          </div>
        `)
        .openOn(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!drawnItemsRef.current) return;
    drawnItemsRef.current.clearLayers();

    polygons.forEach(p => {
      const color = getPolygonColor(p.last_mow_date);
      const polygonLayer = L.geoJSON(p.coordinates, {
        style: {
          fillColor: color,
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        },
        id: p.id,
        name: p.name,
        last_mow_date: p.last_mow_date,
        area: turfArea(p.coordinates)
      }).addTo(drawnItemsRef.current!);
      polygonLayer.bindPopup(`<strong>${p.name}</strong>`);
    });
  }, [polygons]);

  return <div id="map-wrap" className="h-full w-full" />;
}