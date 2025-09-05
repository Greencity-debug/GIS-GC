'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, LayersControl } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { createClient } from '@supabase/supabase-js';
import { LatLngExpression } from 'leaflet';

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
    const [polygons, setPolygons] = useState<any>();
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPolygons = async (term = '') => {
      let query = supabase.from('polygons').select('name, geometry');

      if (term) {
        query = query.filter('name', 'ilike', `%${term}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Ошибка загрузки полигонов:', error);
        return;
      }

      const geojsonFeatures = data.map(item => ({
        type: 'Feature',
        properties: { name: item.name },
        geometry: item.geometry
      }));

      const featureCollection = {
        type: 'FeatureCollection',
        features: geojsonFeatures
      };

      setPolygons(featureCollection);
    };

    useEffect(() => {
      fetchPolygons(searchTerm);
    }, [searchTerm]);

    const onPolygonCreated = (e: any) => {
      const { layer } = e;
      const geojson = layer.toGeoJSON();
      savePolygonToSupabase(geojson);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };

    return (
      <>
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <MapContainer center={center} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Схема">
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Спутник">
                <TileLayer
                  attribution='Map data © <a href="https://www.bing.com/maps">Bing Maps</a>'
                  url="https://ecn.t0.tiles.virtualearth.net/tiles/a{q}.jpeg?g=587&mkt=en-US&shading=hill"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Гибрид">
                <TileLayer
                  attribution='Map data © <a href="https://www.bing.com/maps">Bing Maps</a>'
                  url="https://ecn.t0.tiles.virtualearth.net/tiles/h{q}.jpeg?g=587&mkt=en-US&shading=hill"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            {polygons && <GeoJSON data={polygons} />}
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
      </>
    );
};

export default Map;