import { RecyclingLocator } from "@/components/recycling-locator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, MapPin, AlertTriangle, Search, Award, Shield, Globe, Users, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LocatorPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Configuration Required
            </h2>
            <p className="text-gray-600">
              Google Maps API key needs to be configured
            </p>
          </div>
          
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Terminal className="w-5 h-5 text-red-600" />
                Setup Required
              </CardTitle>
              <CardDescription>
                To use the recycling locator, you need to configure the Google Maps API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <Terminal className="h-4 w-4" />
                <AlertTitle className="text-red-800">Configuration Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  The Google Maps API key is not configured correctly. For local development, please add your key to the{' '}
                  <code className="font-mono bg-red-100 px-1 py-0.5 rounded-sm text-red-800">.env.local</code> file.
                </AlertDescription>
              </Alert>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">How to set up:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Get a Google Maps API key from Google Cloud Console</li>
                  <li>2. Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file</li>
                  <li>3. Add: <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here</code></li>
                  <li>4. Restart your development server</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Recycling Center Locator
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">Find certified e-waste recycling facilities near you</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Award className="w-3 h-3 mr-1" />
            Certified Centers
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            Secure Disposal
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Globe className="w-3 h-3 mr-1" />
            Global Network
          </Badge>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="card-hover bg-gradient-to-br from-purple-50 to-purple-100/50 border-0 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-600">Certified Centers</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-800">500+</p>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-to-br from-blue-50 to-blue-100/50 border-0 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600">Countries Covered</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-800">50+</p>
              </div>
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover bg-gradient-to-br from-green-50 to-green-100/50 border-0 shadow-lg sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-600">Users Helped</p>
                <p className="text-xl sm:text-2xl font-bold text-green-800">10K+</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Locator Component */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Find Recycling Centers
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your location to discover certified e-waste recycling facilities and donation centers in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecyclingLocator />
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              Why Recycle Electronics?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Prevents toxic materials from entering landfills</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Recovers valuable metals and materials</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Reduces energy consumption in manufacturing</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Protects natural resources and ecosystems</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              What We Accept
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Smartphones, tablets, and mobile devices</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Laptops, desktops, and computer accessories</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Televisions, monitors, and home electronics</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Batteries, cables, and small appliances</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
