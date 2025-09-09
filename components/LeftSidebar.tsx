'use client';

import { useState } from 'react';
import { FaPencilRuler, FaLayerGroup, FaSearch } from 'react-icons/fa';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

type Layer = {
  id: string;
  name: string;
};

type Props = {
  layers: Layer[];
};

export default function LeftSidebar({ layers }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tools' | 'layers'>('tools');

  const handleAddLayer = () => {
    const newLayerName = prompt('Введите название нового слоя:');
    if (newLayerName) {
      console.log('Создание нового слоя:', newLayerName);
      router.refresh();
    }
  };

  return (
    <div className="flex-none w-80 bg-white shadow-xl flex flex-col p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Зеленый город</h1>
      <div className="border-b border-gray-200 mb-4 flex">
        <button
          onClick={() => setActiveTab('tools')}
          className={clsx(
            'flex-1 p-2 text-center border-b-2',
            activeTab === 'tools' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
          )}
        >
          <FaPencilRuler className="inline-block mr-2" /> Инструменты
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={clsx(
            'flex-1 p-2 text-center border-b-2',
            activeTab === 'layers' ? 'border-primary text-primary' : 'border-transparent text-gray-500'
          )}
        >
          <FaLayerGroup className="inline-block mr-2" /> Слои
        </button>
      </div>

      {activeTab === 'tools' && (
        <div className="p-2">
          <p className="font-bold text-lg mb-2">Рисование и редактирование</p>
          <div className="flex space-x-2">
            <button className="flex-1 p-2 rounded bg-gray-200 hover:bg-gray-300">
              <FaPencilRuler /> Рисовать
            </button>
            <button className="flex-1 p-2 rounded bg-gray-200 hover:bg-gray-300">
              <FaPencilRuler /> Редактировать
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Используйте кнопки для активации инструментов на карте.
          </p>
        </div>
      )}

      {activeTab === 'layers' && (
        <div className="p-2">
          <h2 className="font-bold text-lg mb-2">Управление слоями</h2>
          <ul className="space-y-2 mb-4">
            {layers.map(layer => (
              <li key={layer.id} className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-primary" defaultChecked />
                <span>{layer.name}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleAddLayer}
            className="w-full p-2 rounded bg-primary text-white hover:bg-green-700"
          >
            Добавить новый слой
          </button>
        </div>
      )}
    </div>
  );
}