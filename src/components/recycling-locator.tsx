"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, Pin, Phone, Clock } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, Pin as MapPin } from '@vis.gl/react-google-maps';

const centers = [
  {
    id: '1',
    name: 'GreenCycle Hub',
    address: '123 Eco Lane, Greenfield, GA 12345',
    services: ['Drop-off', 'Pickup', 'Data Destruction'],
    hours: 'Mon-Fri: 9am - 5pm',
    phone: '(555) 123-4567',
    position: { lat: 33.7490, lng: -84.3880 } // Approx. Atlanta, GA
  },
  {
    id: '2',
    name: 'Re-Tech Solutions',
    address: '456 Circuit Ave, Techville, CA 98765',
    services: ['Drop-off', 'Repair'],
    hours: 'Tue-Sat: 10am - 6pm',
    phone: '(555) 987-6543',
    position: { lat: 34.0522, lng: -118.2437 } // Approx. Los Angeles, CA
  },
  {
    id: '3',
    name: 'EarthSavers Electronics',
    address: '789 Planet St, Metro City, NY 54321',
    services: ['Drop-off', 'Pickup', 'Donation'],
    hours: 'Mon-Sat: 8am - 4pm',
    phone: '(555) 246-8135',
    position: { lat: 40.7128, lng: -74.0060 } // Approx. New York, NY
  },
   {
    id: '4',
    name: 'Community E-Waste Drive',
    address: '101 Civic Center Plaza, Downtown',
    services: ['Drop-off', 'Mobile Phones'],
    hours: 'Weekends: 10am - 2pm',
    phone: '(555) 369-1472',
    position: { lat: 41.8781, lng: -87.6298 } // Approx. Chicago, IL
  }
];

const LocatorMap = () => {
    const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // Center of US
    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                <Map 
                    defaultCenter={defaultCenter} 
                    defaultZoom={4} 
                    mapId="ecovision_map"
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                >
                    {centers.map((center) => (
                        <AdvancedMarker key={center.id} position={center.position} title={center.name}>
                            <MapPin scale={1.2}>
                                <div style={{
                                    width: 24,
                                    height: 24,
                                    backgroundColor: 'hsl(var(--primary))',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}></div>
                            </MapPin>
                        </AdvancedMarker>
                    ))}
                </Map>
            </APIProvider>
        </div>
    )
}


export function RecyclingLocator() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Recycling & Donation Locator</CardTitle>
        <CardDescription>Find certified centers near you to dispose of your e-waste responsibly.</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapIcon className="h-5 w-5 text-primary"/> Interactive Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {apiKey ? (
                <LocatorMap />
            ) : (
                <div className="text-center text-muted-foreground p-4 bg-muted">
                    <p>Google Maps API key is missing. Please add it to your environment variables to enable the map.</p>
                </div>
            )}
          </CardContent>
        </Card>
        
        <h3 className="text-2xl font-headline font-semibold mb-4 text-primary">Nearby Centers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {centers.map(center => (
            <Card key={center.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{center.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1"><Pin className="h-4 w-4"/> {center.address}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4"/>
                  <span>{center.hours}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Phone className="h-4 w-4"/>
                  <span>{center.phone}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {center.services.map(service => (
                    <Badge key={service} variant="secondary">{service}</Badge>
                  ))}
                </div>
              </CardContent>
               <CardFooter>
                 <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-semibold">
                    Get Directions &rarr;
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
