"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Pin, Phone, Clock } from "lucide-react";
import Image from "next/image";

const centers = [
  {
    id: '1',
    name: 'GreenCycle Hub',
    address: '123 Eco Lane, Greenfield, GA 12345',
    services: ['Drop-off', 'Pickup', 'Data Destruction'],
    hours: 'Mon-Fri: 9am - 5pm',
    phone: '(555) 123-4567',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'recycling center'
  },
  {
    id: '2',
    name: 'Re-Tech Solutions',
    address: '456 Circuit Ave, Techville, CA 98765',
    services: ['Drop-off', 'Repair'],
    hours: 'Tue-Sat: 10am - 6pm',
    phone: '(555) 987-6543',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'electronics repair'
  },
  {
    id: '3',
    name: 'EarthSavers Electronics',
    address: '789 Planet St, Metro City, NY 54321',
    services: ['Drop-off', 'Pickup', 'Donation'],
    hours: 'Mon-Sat: 8am - 4pm',
    phone: '(555) 246-8135',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'warehouse interior'
  },
   {
    id: '4',
    name: 'Community E-Waste Drive',
    address: '101 Civic Center Plaza, Downtown',
    services: ['Drop-off', 'Mobile Phones'],
    hours: 'Weekends: 10am - 2pm',
    phone: '(555) 369-1472',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'community center'
  }
];


export function RecyclingLocator() {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Recycling & Donation Locator</CardTitle>
        <CardDescription>Find certified centers near you to dispose of your e-waste responsibly.</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5 text-primary"/> Interactive Map</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground p-0">
             <Image 
                src="https://placehold.co/800x400.png"
                alt="Map placeholder"
                width={800}
                height={400}
                className="w-full object-cover"
                data-ai-hint="world map"
             />
             <p className="p-4 bg-muted">Interactive map functionality coming soon.</p>
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
