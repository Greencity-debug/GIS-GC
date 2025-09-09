'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './ui/Modal';

type Props = {
  polygonId?: string;
  onClose: () => void;
};

export default function PolygonForm({ polygonId, onClose }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Газон');
  const [area, setArea] = useState(0);
  const [lastMowDate, setLastMowDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, description, category, area, lastMowDate, polygonId };
    console.log('Submitting data:', data);

    // Логика отправки на API
    // if (polygonId) {
    //   // Update logic
    // } else {
    //   // Create logic
    // }

    router.refresh(); // Обновление данных на странице
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">
          {polygonId ? `Редактировать полигон #${polygonId}` : 'Создать новый полигон'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Название</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Описание</label>
            <textarea
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Категория</label>
            <select
              className="w-full p-2 border rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Газон</option>
              <option>Клумба</option>
              <option>Рабатка</option>
              <option>Кашпо</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Площадь (м²)</label>
            <input
              type="number"
              className="w-full p-2 border rounded bg-gray-100"
              value={area.toFixed(2)}
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Дата последней обработки</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={lastMowDate}
              onChange={(e) => setLastMowDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="p-2 rounded bg-primary text-white hover:bg-green-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}