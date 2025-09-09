import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { turfArea } from '@turf/area';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { coordinates, name, description, category, layer_id } = await req.json();

    if (!coordinates || !name || !layer_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const area_sq_m = turfArea({
      "type": "Polygon",
      "coordinates": coordinates
    });

    const { data, error } = await supabase
      .from('polygons')
      .insert([
        {
          name,
          description,
          category,
          area_sq_m,
          layer_id,
          coordinates,
          last_mow_date: new Date().toISOString().split('T')[0],
        }
      ])
      .select('id, polygon_id');

    if (error) {
      console.error('Database insertion error:', error);
      return NextResponse.json({ error: 'Failed to create polygon' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Polygon created successfully',
      polygon: data[0]
    }, { status: 201 });
  } catch (err) {
    console.error('Request processing error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}