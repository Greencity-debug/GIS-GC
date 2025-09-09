import { getDistance } from '@turf/distance';

export function getPolygonColor(lastMowDate: string): string {
  const today = new Date();
  const lastDate = new Date(lastMowDate);
  const diffDays = Math.ceil(Math.abs(today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return '#00FF00';
  if (diffDays <= 3) return '#24FF00';
  if (diffDays <= 5) return '#48FF00';
  if (diffDays <= 7) return '#6DFF00';
  if (diffDays <= 9) return '#FFFF00';
  if (diffDays <= 11) return '#FFDA00';
  if (diffDays <= 13) return '#FFB600';
  if (diffDays <= 15) return '#FF9100';
  return '#FF0000';
}