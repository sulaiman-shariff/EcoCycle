import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthContextProvider } from '@/lib/firebase/auth';

export const metadata: Metadata = {
  title: 'EcoCycle',
  description: 'Your guide to responsible e-waste management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <AuthContextProvider>
          <div className="flex flex-col min-h-screen w-full">
            <main className="w-full flex-1 flex flex-col px-2 sm:px-6 md:px-8">
              {children}
            </main>
          </div>
        </AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
