import { RecyclingLocator } from "@/components/recycling-locator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function LocatorPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    return (
      <div className="flex justify-center items-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            The Google Maps API key is not configured correctly. For local development, please add your key to the <code className="font-mono bg-muted px-1 py-0.5 rounded-sm">.env.local</code> file.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <RecyclingLocator apiKey={apiKey} />;
}
