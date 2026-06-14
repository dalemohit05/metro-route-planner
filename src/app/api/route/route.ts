import { NextRequest, NextResponse } from 'next/server';
import { dijkstra } from '@/lib/metro/dijkstra';
import { STATIONS } from '@/lib/metro/data';

export async function GET(request: NextRequest) {
  // Get source and destination from URL
  // Example: /api/route?from=0&to=25
  const searchParams = request.nextUrl.searchParams;
  const from = parseInt(searchParams.get('from') || '0');
  const to = parseInt(searchParams.get('to') || '0');

  // Validate inputs
  if (isNaN(from) || isNaN(to)) {
    return NextResponse.json(
      { error: 'Invalid station indices' },
      { status: 400 }
    );
  }

  if (from === to) {
    return NextResponse.json(
      { error: 'Source and destination cannot be the same' },
      { status: 400 }
    );
  }

  if (from < 0 || from >= STATIONS.length || to < 0 || to >= STATIONS.length) {
    return NextResponse.json(
      { error: 'Station index out of range' },
      { status: 400 }
    );
  }

  // Run Dijkstra for shortest distance
  const result = dijkstra(from, to, 'distance');

  if (!result.found) {
    return NextResponse.json(
      { error: 'No route found between these stations' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    from: STATIONS[from].name,
    to: STATIONS[to].name,
    result,
  });
}