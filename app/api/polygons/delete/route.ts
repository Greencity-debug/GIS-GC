import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import type { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { polygon_id } = await req.json();
    if (!polygon_id) {
      return NextResponse.json({ error: 'Missing polygon_id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('polygons')
      .delete()
      .eq('id', polygon_id);

    if (error) {
      console.error('Database deletion error:', error);
      return NextResponse.json({ error: 'Failed to delete polygon' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Polygon deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Request processing error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}