"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MapPin, Search, AlertTriangle, Navigation, Star, Clock, Award, Shield, Leaf } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  rating?: number;
  distance?: number;
  placeId?: string;
  types?: string[];
  openingHours?: string;
  location?: { lat: number; lng: number };
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Fallback data for testing when API key is not available
const FALLBACK_CENTERS: RecyclingCenter[] = [
  {
    id: '1',
    name: 'E-Waste Recyclers Bangalore',
    address: 'Electronic City, Bangalore, Karnataka 560100',
    rating: 4.2,
    distance: 2.5,
    types: ['electronics_recycling', 'e-waste_center'],
    openingHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    location: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '2',
    name: 'Green Earth Recycling Solutions',
    address: 'Whitefield, Bangalore, Karnataka 560066',
    rating: 4.5,
    distance: 5.8,
    types: ['electronics_recycling', 'certified_recycler'],
    openingHours: 'Mon-Sat: 8:00 AM - 7:00 PM',
    location: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: '3',
    name: 'TechCycle India',
    address: 'Koramangala, Bangalore, Karnataka 560034',
    rating: 4.0,
    distance: 3.2,
    types: ['electronics_recycling', 'data_destruction'],
    openingHours: 'Mon-Fri: 10:00 AM - 5:00 PM',
    location: { lat: 12.9716, lng: 77.5946 }
  }
];

async function searchRecyclingCenters(location: string): Promise<RecyclingCenter[]> {
  try {
    const response = await fetch(`/api/recycling-centers?location=${encodeURIComponent(location)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch recycling centers');
    }
    
    return data.centers || [];
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

export function RecyclingLocator() {
  const [location, setLocation] = useState('');
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleSearch = async () => {
    if (!location.trim()) {
      setError('Please enter a location to search for recycling centers.');
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedCenter(null);
    setCenters([]);
    setUsingFallback(false);
    
    try {
      const results = await searchRecyclingCenters(location);
      
      if (results.length === 0) {
        setError('No recycling centers found near this location. Try a different area.');
      } else {
        setCenters(results);
      }
    } catch (e: any) {
      console.error('Search error:', e);
      setError(`Failed to fetch recycling centers: ${e.message || 'Please try again later.'}`);
    }
    setLoading(false);
  };

  const handleCenterSelect = (center: RecyclingCenter) => {
    setSelectedCenter(center);
  };

  const getDirections = (center: RecyclingCenter) => {
    if (center.location) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${center.location.lat},${center.location.lng}`, '_blank');
    } else if (center.address) {
      const encodedAddress = encodeURIComponent(center.address);
      window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
    }
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    return `${distance.toFixed(1)} km`;
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />);
    }
    return stars;
  };

  // Optionally, use geolocation on mount
  useEffect(() => {
    if (navigator.geolocation && !location) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        setLoading(true);
        setError(null);
        try {
          const { latitude, longitude } = pos.coords;
          // Use reverse geocoding to get location name
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`);
          const data = await response.json();
          const locationName = data.results?.[0]?.formatted_address || `${latitude}, ${longitude}`;
          
          const results = await searchRecyclingCenters(locationName);
          setCenters(results);
        } catch (e) {
          setError('Failed to fetch recycling centers for your location.');
        }
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Enter your city, zip code, or address..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 h-10 sm:h-12 bg-white border-2 hover:border-purple-300 focus:border-purple-500 transition-colors text-sm sm:text-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={loading}
          className="h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? (
            <LoadingSpinner text="Searching for centers..." />
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Centers
            </>
          )}
        </Button>
      </div>



      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-red-800 text-sm">Search Error</AlertTitle>
          <AlertDescription className="text-red-700 text-xs sm:text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {centers.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Found {centers.length} recycling center{centers.length !== 1 ? 's' : ''}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                EPA Certified
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Centers List */}
            <div className="space-y-3 sm:space-y-4">
              {centers.map((center) => (
                <Card 
                  key={center.id} 
                  className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                    selectedCenter?.id === center.id 
                      ? 'border-purple-500 bg-purple-50/50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => handleCenterSelect(center)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{center.name}</h4>
                          {center.rating && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              {center.rating.toFixed(1)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{center.address}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{center.rating}</span>
                            <div className="flex gap-0.5">
                              {renderStars(center.rating)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatDistance(center.distance)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {center.types?.map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            {type}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{center.openingHours}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Center Details */}
            {selectedCenter && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        {selectedCenter.name}
                        {selectedCenter.rating && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Star className="w-3 h-3 mr-1" />
                            {selectedCenter.rating.toFixed(1)}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base mt-2">
                        {selectedCenter.address}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{selectedCenter.rating}</span>
                      <div className="flex gap-0.5">
                        {renderStars(selectedCenter.rating)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800 text-sm sm:text-base">Contact Information</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.location?.lat},${selectedCenter.location?.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          Get Directions
                          <Navigation className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-700">{selectedCenter.openingHours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Accepted Items */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800 text-sm sm:text-base">Accepts</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        <Leaf className="w-3 h-3 mr-1" />
                        Electronics
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        <Leaf className="w-3 h-3 mr-1" />
                        Batteries
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        <Leaf className="w-3 h-3 mr-1" />
                        Appliances
                      </Badge>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800 text-sm sm:text-base">Services</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                        Data Destruction
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                        Pickup Service
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                        Certification
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <Button 
                      onClick={() => getDirections(selectedCenter)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {centers.length === 0 && !loading && location && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-6 sm:p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No recycling centers found</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Try searching for a different location or check back later for updated listings.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
