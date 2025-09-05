'use client';

import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { createClient } from '@supabase/supabase-js';
import { LatLngExpression } from 'leaflet';

// Инициализируем Supabase-клиент прямо в этом файле
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const center: LatLngExpression = [55.933333, 52.283333];

const savePolygonToSupabase = async (geojson: any) => {
  try {
    const { data, error } = await supabase
      .from('polygons')
      .insert({
        name: `Новый полигон (${new Date().toLocaleString()})`,
        geometry: JSON.stringify(geojson.geometry)
      })
      .select();

    if (error) {
      console.error('Ошибка сохранения полигона:', error);
      return;
    }

    console.log('Полигон успешно сохранен:', data);
    alert('Полигон успешно сохранен!');
  } catch (err) {
    console.error('Неожиданная ошибка:', err);
  }
};

const Map = () => {
  const onPolygonCreated = (e: any) => {
    const { layer } = e;
    const geojson = layer.toGeoJSON();
    savePolygonToSupabase(geojson);
  };

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onPolygonCreated}
          draw={{
            polyline: false,
            polygon: { allowIntersection: false },
            circle: false,
            marker: false,
            rectangle: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default Map;