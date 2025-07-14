'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from './LoadingSpinner';

export function PageTransitionLoader() {
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsRouteChanging(true);
    const handleComplete = () => setIsRouteChanging(false);
    router.events?.on('routeChangeStart', handleStart);
    router.events?.on('routeChangeComplete', handleComplete);
    router.events?.on('routeChangeError', handleComplete);
    return () => {
      router.events?.off('routeChangeStart', handleStart);
      router.events?.off('routeChangeComplete', handleComplete);
      router.events?.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (!isRouteChanging) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <LoadingSpinner text="Loading page..." />
    </div>
  );
} 