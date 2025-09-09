'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type Polygon = {
  id: string;
  name: string;
  description: string;
  category: string;
  layer_id: string;
};

type Layer = {
  id: string;
  name: string;
};

type Props = {
  polygons: Polygon[];
  layers: Layer[];
};

export default function RightSidebar({ polygons, layers }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});

  const filteredPolygons = polygons.filter(polygon =>
    polygon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    polygon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    polygon.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLayer = (layerId: string) => {
    setExpandedLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  const polygonsByLayer = layers.reduce<Record<string, Polygon[]>>((acc, layer) => {
    acc[layer.id] = filteredPolygons.filter(p => p.layer_id === layer.id);
    return acc;
  }, {});

  return (
    <div className="flex-none w-80 bg-white shadow-xl flex flex-col p-4">
      <h2 className="font-bold text-lg mb-2">Поиск</h2>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Найти полигон..."
          className="w-full p-2 pl-8 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-2 top-3 text-gray-400" />
      </div>

      <h2 className="font-bold text-lg mb-2">Список полигонов</h2>
      <div className="flex-grow overflow-y-auto">
        {layers.map(layer => (
          <div key={layer.id} className="mb-2">
            <button
              onClick={() => toggleLayer(layer.id)}
              className="w-full text-left p-2 bg-gray-100 rounded flex justify-between items-center"
            >
              <span className="font-semibold">{layer.name} ({polygonsByLayer[layer.id]?.length || 0})</span>
              {expandedLayers[layer.id] ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedLayers[layer.id] && (
              <ul className="mt-2 space-y-1 pl-4">
                {polygonsByLayer[layer.id]?.map(polygon => (
                  <li key={polygon.id} className="p-1 rounded cursor-pointer hover:bg-gray-200">
                    {polygon.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}