import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { polygon_id } = await req.json();
    if (!polygon_id) {
      return NextResponse.json({ error: 'Missing polygon_id' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    const { data: polygonData, error: polygonError } = await supabase
      .from('polygons')
      .update({ last_mow_date: today })
      .eq('id', polygon_id)
      .select('area_sq_m');

    if (polygonError) {
      console.error('Failed to update polygon date:', polygonError);
      return NextResponse.json({ error: 'Failed to update polygon' }, { status: 500 });
    }

    const currentArea = polygonData[0]?.area_sq_m || 0;

    const { data: existingOrder, error: orderFetchError } = await supabase
      .from('orders')
      .select('id, polygon_ids, total_area_sq_m')
      .eq('order_date', today)
      .single();

    if (orderFetchError && orderFetchError.code !== 'PGRST116') {
      console.error('Error fetching order:', orderFetchError);
      return NextResponse.json({ error: 'Failed to find or create order' }, { status: 500 });
    }

    let order;
    if (existingOrder) {
      const updatedPolygonIds = existingOrder.polygon_ids.includes(polygon_id) ? existingOrder.polygon_ids : [...existingOrder.polygon_ids, polygon_id];
      const updatedTotalArea = existingOrder.total_area_sq_m + currentArea;

      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({
          polygon_ids: updatedPolygonIds,
          total_area_sq_m: updatedTotalArea,
        })
        .eq('id', existingOrder.id)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update existing order:', updateError);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
      }
      order = updatedOrder;
    } else {
      const { data: newOrder, error: createError } = await supabase
        .from('orders')
        .insert({
          order_date: today,
          polygon_ids: [polygon_id],
          total_area_sq_m: currentArea,
          created_by_id: user.id,
        })
        .select()
        .single();

      if (createError) {
        console.error('Failed to create new order:', createError);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
      }
      order = newOrder;
    }

    return NextResponse.json({
      message: 'Polygon mowed and order updated',
      order
    }, { status: 200 });
  } catch (err) {
    console.error('Request processing error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}