'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImpactCalculator } from "@/components/impact-calculator";
import { AiChatbot } from "@/components/ai-chatbot";
import { DeviceAnalyzer } from "@/components/device-analyzer";
import { UserStats } from "@/components/user-stats";
import LocatorPage from "../locator/page";
import { Leaf, LogOut, User, Settings, Bell, Search, BarChart3, MessageCircle, MapPin, Calculator, Camera, BarChart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logOut } from "@/lib/firebase/auth";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("calculator");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, isClient]);

  if (!isClient || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "calculator":
        return <Calculator className="w-4 h-4" />;
      case "chatbot":
        return <MessageCircle className="w-4 h-4" />;
      case "locator":
        return <MapPin className="w-4 h-4" />;
      case "analyzer":
        return <Camera className="w-4 h-4" />;
      case "stats":
        return <BarChart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="w-full flex h-14 sm:h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 group-hover:text-green-700 transition-colors" />
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl sm:text-2xl font-headline bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              EcoCycle
            </span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Badge variant="secondary" className="hidden sm:flex">
              <BarChart3 className="w-3 h-3 mr-1" />
              Dashboard
            </Badge>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600 p-2">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="w-full px-4 md:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Welcome back!
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Ready to make a difference for India? Let's calculate your environmental impact as per Indian e-waste rules.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                🌱 Eco-Friendly
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                📊 Data-Driven
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Card className="card-hover bg-gradient-to-br from-green-50 to-green-100/50 border-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-600">Devices Analysed (India)</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-800">8+</p>
                </div>
                <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover bg-gradient-to-br from-blue-50 to-blue-100/50 border-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-600">CPCB/MoEFCC Compliant</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-800">100%</p>
                </div>
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover bg-gradient-to-br from-purple-50 to-purple-100/50 border-0 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-purple-600">AI Assistant (India)</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-800">24/7</p>
                </div>
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 sm:p-6">
              <TabsList className="grid w-full grid-cols-5 bg-white/20 backdrop-blur-sm border-0 h-auto">
                <TabsTrigger 
                  value="calculator" 
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-white hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm py-2 sm:py-3"
                >
                  <Calculator className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Calculator</span>
                  <span className="sm:hidden">Calc</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="chatbot" 
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-white hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm py-2 sm:py-3"
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Assistant</span>
                  <span className="sm:hidden">AI</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="locator" 
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 text-white hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm py-2 sm:py-3"
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Locator</span>
                  <span className="sm:hidden">Map</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analyzer" 
                  className="data-[state=active]:bg-white data-[state=active]:text-orange-600 text-white hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm py-2 sm:py-3"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Analyzer</span>
                  <span className="sm:hidden">Scan</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="stats" 
                  className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 text-white hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm py-2 sm:py-3"
                >
                  <BarChart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Stats</span>
                  <span className="sm:hidden">Stats</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4 sm:p-6">
              <TabsContent value="calculator" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Environmental Impact Calculator (India)</h2>
                  </div>
                  <ImpactCalculator />
                </div>
              </TabsContent>
              
              <TabsContent value="chatbot" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">AI-Powered Assistant (India)</h2>
                  </div>
                  <AiChatbot />
                </div>
              </TabsContent>
              
              <TabsContent value="locator" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recycling Centre Locator (India)</h2>
                  </div>
                  <LocatorPage />
                </div>
              </TabsContent>
              
              <TabsContent value="analyzer" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Device Image Analyser (India)</h2>
                  </div>
                  <DeviceAnalyzer />
                </div>
              </TabsContent>
              
              <TabsContent value="stats" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <BarChart className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Your Recycling Statistics</h2>
                  </div>
                  <UserStats />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">EcoCycle</span>
            </div>
            <p className="text-xs text-gray-500 max-w-md px-4 sm:px-0">
              Making e-waste management sustainable and accessible for everyone. 
              Join us in building a greener future, one device at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-gray-400">
              <span>&copy; {new Date().getFullYear()} EcoCycle</span>
              <span className="hidden sm:inline">•</span>
              <span>Privacy Policy</span>
              <span className="hidden sm:inline">•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
