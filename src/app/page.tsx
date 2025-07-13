import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImpactCalculator } from "@/components/impact-calculator";
import { AiChatbot } from "@/components/ai-chatbot";
import { RecyclingLocator } from "@/components/recycling-locator";
import { Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-2">
          <Leaf className="w-10 h-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            EcoVision
          </h1>
        </div>
        <p className="mt-1 text-lg text-muted-foreground font-body">
          Your guide to responsible e-waste management.
        </p>
      </header>
      <main className="w-full max-w-4xl">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-primary/10">
            <TabsTrigger value="calculator">Impact Calculator</TabsTrigger>
            <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
            <TabsTrigger value="locator">Recycling Locator</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator" className="mt-6">
            <ImpactCalculator />
          </TabsContent>
          <TabsContent value="chatbot" className="mt-6">
            <AiChatbot />
          </TabsContent>
          <TabsContent value="locator" className="mt-6">
            <RecyclingLocator />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} EcoVision. Making a greener planet, one device at a time.</p>
      </footer>
    </div>
  );
}
