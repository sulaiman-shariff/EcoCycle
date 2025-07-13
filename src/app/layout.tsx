import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import dynamic from 'next/dynamic';

// Dynamically import AuthContextProvider to prevent SSR issues
const AuthContextProvider = dynamic(() => import('@/lib/firebase/auth').then(mod => ({ default: mod.AuthContextProvider })), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50" />
});

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
      <body className="font-body antialiased">
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
