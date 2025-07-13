import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is not configured.');
    return null;
  }
  
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

async function fetchNearbyCenters(lat: number, lng: number): Promise<any[]> {
    if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is not configured.');
    return [];
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&keyword=e-waste%20recycling|electronics%20recycling|e-waste%20center&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results;
    }
    return [];
  } catch (error) {
    console.error('Places API error:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    
    if (!location) {
      return NextResponse.json({ error: 'Location parameter is required' }, { status: 400 });
    }

    // Geocode the address
    const coords = await geocodeAddress(location);
    if (!coords) {
      return NextResponse.json({ error: 'Could not find the specified location' }, { status: 404 });
    }

    // Fetch nearby centers
    const centers = await fetchNearbyCenters(coords.lat, coords.lng);
    
    // Transform the data
    const transformedCenters = centers.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address,
      rating: place.rating,
      types: place.types,
      location: place.geometry.location,
      openingHours: place.opening_hours?.weekday_text?.join(', '),
      placeId: place.place_id,
    }));

    return NextResponse.json({ centers: transformedCenters });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch recycling centers' }, { status: 500 });
  }
}
