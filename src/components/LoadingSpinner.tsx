'use client';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
      <span className="text-blue-700 font-medium animate-pulse">{text}</span>
    </div>
  );
} 