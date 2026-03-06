'use client';

import dynamic from 'next/dynamic';
import { ChatMessage } from '@/lib/types';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#12121e]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
        <p className="text-sm text-[#6e6e82]">Loading map...</p>
      </div>
    </div>
  ),
});

interface MapViewWrapperProps {
  messages: ChatMessage[];
  userCity: string | null;
  onClose: () => void;
  isVisible: boolean;
}

export default function MapViewWrapper(props: MapViewWrapperProps) {
  return <div className="h-full w-full"><MapView {...props} /></div>;
}
