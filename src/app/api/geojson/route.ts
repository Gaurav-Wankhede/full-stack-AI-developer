import { NextResponse } from 'next/server';

export async function GET() {
  const geoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [10.6, 47.9],
              [5.8, 47.9],
              [5.8, 45.8],
              [10.6, 45.8],
              [10.6, 47.9]
            ]
          ]
        },
        properties: {
          name: "Switzerland",
          secondProperty: "Something else"
        }
      },
      // Add more features for other countries
    ]
  };

  return NextResponse.json(geoJson);
}

