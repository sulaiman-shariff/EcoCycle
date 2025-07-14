'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LoadingSpinner } from './LoadingSpinner';

export function PageTransitionLoader() {
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsRouteChanging(true);
    const timeout = setTimeout(() => setIsRouteChanging(false), 500); // Adjust delay as needed
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!isRouteChanging) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <LoadingSpinner text="Loading page..." />
    </div>
  );
} 