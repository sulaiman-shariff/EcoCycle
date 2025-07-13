import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Recycle, Bot, MapPin, Calculator, TrendingUp, Globe, Shield, Zap, Users, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 font-bold group">
            <div className="relative">
              <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 group-hover:text-green-700 transition-colors" />
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl sm:text-2xl font-headline bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              EcoCycle
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
              About
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </nav>
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 sm:py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 via-blue-100/30 to-purple-100/50"></div>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-40 right-4 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-8 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          <div className="container relative z-10 text-center px-4 sm:px-6">
            <Badge variant="secondary" className="mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
              🌱 Making E-Waste Management Sustainable
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-headline font-bold tracking-tighter bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Turn E-Waste Into
              <br />
              <span className="text-green-600">Environmental Gold</span>
            </h1>
            <p className="mx-auto mt-4 sm:mt-6 max-w-[700px] text-base sm:text-lg text-gray-600 md:text-xl leading-relaxed px-4 sm:px-0">
              Discover the real environmental impact of your devices, find certified recycling centers, and get expert guidance on responsible e-waste management.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                  Calculate Your Impact
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold transition-all duration-300">
                <Link href="/locator" className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  Find Recycling Centers
                </Link>
              </Button>
            </div>
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 px-4 sm:px-0">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span>Certified Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                <span>Global Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 sm:py-20 md:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 sm:mb-16">
              <Badge variant="secondary" className="mb-4 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
                ✨ Key Features
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline font-bold tracking-tighter bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent px-4 sm:px-0">
                Your Complete E-Waste Toolkit
              </h2>
              <p className="max-w-[900px] text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl/relaxed px-4 sm:px-0">
                Everything you need to make informed decisions about your electronic devices and contribute to a healthier planet.
              </p>
            </div>
            
            <div className="mx-auto grid max-w-6xl items-start gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50">
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-headline text-green-800">
                    Smart Impact Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 space-y-3">
                  <p className="text-sm sm:text-base">Calculate the real environmental footprint of your devices using EPA data and discover the value of recoverable materials.</p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600 font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    Real-time data integration
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50">
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-headline text-blue-800">
                    AI-Powered Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 space-y-3">
                  <p className="text-sm sm:text-base">Get instant, reliable answers to all your e-waste questions with our intelligent chatbot powered by advanced AI.</p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-medium">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    24/7 expert guidance
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-headline text-purple-800">
                    Recycling Locator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 space-y-3">
                  <p className="text-sm sm:text-base">Find certified e-waste recycling centers and donation points with our interactive map and detailed facility information.</p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-600 font-medium">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                    Certified facilities only
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 sm:py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl sm:text-4xl font-bold">8+</div>
                <div className="text-green-100 text-sm sm:text-base">Device Types Analyzed</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl sm:text-4xl font-bold">100%</div>
                <div className="text-green-100 text-sm sm:text-base">EPA Data Compliant</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl sm:text-4xl font-bold">∞</div>
                <div className="text-green-100 text-sm sm:text-base">Environmental Impact</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 sm:py-20 bg-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Ready to Make a Difference?
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
              Join thousands of users who are already making informed decisions about their electronic devices and contributing to a sustainable future.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/dashboard" className="flex items-center justify-center gap-2">
                <Recycle className="w-4 h-4 sm:w-5 sm:h-5" />
                Start Your Journey
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 sm:py-12 w-full bg-gray-50 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              <span className="text-lg sm:text-xl font-headline font-bold text-gray-800">EcoCycle</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md px-4 sm:px-0">
              Making e-waste management sustainable and accessible for everyone. 
              Join us in building a greener future, one device at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-gray-500">
              <span>&copy; {new Date().getFullYear()} EcoCycle. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span>Privacy Policy</span>
              <span className="hidden sm:inline">•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
