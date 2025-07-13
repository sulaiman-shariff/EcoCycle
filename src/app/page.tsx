import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Recycle, Bot, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-2xl font-headline text-primary">EcoVision</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           <Image 
            src="https://placehold.co/1920x1080.png" 
            alt="Hero background" 
            fill={true}
            style={{objectFit: 'cover'}}
            className="z-0 opacity-20"
            data-ai-hint="nature technology"
           />
          <div className="container relative z-10 text-center">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
              Turn E-Waste Into a Greener Future
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              EcoVision helps you understand the impact of your electronic devices, find recycling centers, and get answers to all your e-waste questions.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard">Calculate Your Impact Now</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key Features</div>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Your Toolkit for Responsible E-Waste Management</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We provide all the tools you need to make informed decisions about your electronic devices and contribute to a healthier planet.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Recycle className="w-8 h-8 text-primary" />
                    Impact Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  See the real environmental footprint of your devices and discover the value of the raw materials inside them.
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Bot className="w-8 h-8 text-primary" />
                    AI Chatbot
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Have a question about recycling or sustainability? Get instant, reliable answers from our AI-powered assistant.
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <MapPin className="w-8 h-8 text-primary" />
                    Recycling Locator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Find certified e-waste recycling centers and donation points across India with our interactive map.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} EcoVision. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Making a greener planet, one device at a time.</p>
        </div>
      </footer>
    </div>
  );
}
