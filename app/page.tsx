import { supabase } from "./lib/supabase";
import MapContainer from "@/components/MapContainer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { AuthProvider } from "@/components/AuthProvider";
import { redirect } from 'next/navigation';

async function getPolygons() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('polygons')
    .select('id, name, coordinates, last_mow_date, layer_id');

  if (error) {
    console.error('Failed to fetch polygons:', error);
    return [];
  }
  return data;
}

async function getLayers() {
  const { data, error } = await supabase
    .from('layers')
    .select('id, name');

  if (error) {
    console.error('Failed to fetch layers:', error);
    return [];
  }
  return data;
}

export default async function Home() {
  const polygons = await getPolygons();
  const layers = await getLayers();

  return (
    <AuthProvider>
      <div className="flex h-screen w-screen">
        <LeftSidebar layers={layers} />
        <div id="map-wrap" className="relative flex-grow">
          <MapContainer polygons={polygons} />
        </div>
        <RightSidebar polygons={polygons} layers={layers} />
      </div>
    </AuthProvider>
  );
}