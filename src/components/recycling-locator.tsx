"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, Pin, Phone, Clock } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, Pin as MapPin } from '@vis.gl/react-google-maps';

const centers = [
  {
    id: '1',
    name: 'E-Waste Recyclers India',
    address: '15/3, Mathura Road, Faridabad, New Delhi, Delhi 110044',
    services: ['Drop-off', 'Pickup', 'Data Destruction'],
    hours: 'Mon-Sat: 10am - 6pm',
    phone: '(+91) 98765 43210',
    position: { lat: 28.6139, lng: 77.2090 } // Approx. Delhi
  },
  {
    id: '2',
    name: 'Eco-Reco',
    address: 'Plot No. R-267, TTC Industrial Area, Rabale, Navi Mumbai, Maharashtra 400701',
    services: ['Drop-off', 'Corporate Collection'],
    hours: 'Mon-Fri: 9:30am - 5:30pm',
    phone: '(+91) 22-1234-5678',
    position: { lat: 19.0760, lng: 72.8777 } // Approx. Mumbai
  },
  {
    id: '3',
    name: 'Saahas Zero Waste',
    address: '#21, MCHS Colony, 5th C Cross, 16th Main, BTM Layout 2nd Stage, Bengaluru, Karnataka 560076',
    services: ['Drop-off', 'Awareness Programs'],
    hours: 'Mon-Sat: 9am - 5pm',
    phone: '(+91) 80-9876-5432',
    position: { lat: 12.9716, lng: 77.5946 } // Approx. Bangalore
  },
   {
    id: '4',
    name: 'Virogreen India Pvt. Ltd.',
    address: 'No. 3/2, GST Road, Vandalur, Chennai, Tamil Nadu 600048',
    services: ['Drop-off', 'Electronics Recycling'],
    hours: 'Mon-Fri: 10am - 5pm',
    phone: '(+91) 44-5678-1234',
    position: { lat: 13.0827, lng: 80.2707 } // Approx. Chennai
  }
];

const LocatorMap = ({ apiKey }: { apiKey: string }) => {
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India
    return (
        <div className="h-[400px] w-full rounded-lg overflow-hidden border">
            <APIProvider apiKey={apiKey}>
                <Map 
                    defaultCenter={defaultCenter} 
                    defaultZoom={5} 
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


export function RecyclingLocator({ apiKey }: { apiKey: string }) {
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
              <LocatorMap apiKey={apiKey} />
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
