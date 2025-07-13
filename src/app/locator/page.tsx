import { RecyclingLocator } from "@/components/recycling-locator";

export default function LocatorPage() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Google Maps API key is not configured on the server.</p>
      </div>
    );
  }

  return <RecyclingLocator apiKey={apiKey} />;
}
