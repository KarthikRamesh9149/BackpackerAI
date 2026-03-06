'use client';

import { useState } from 'react';
import { canNativeShare } from '@/lib/shareFormatter';

interface ShareButtonProps {
  content: string;
  title?: string;
  variant?: 'icon' | 'full';
}

export default function ShareButton({ content, title = 'BackpackBuddy AU', variant = 'icon' }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    if (canNativeShare()) {
      try {
        await navigator.share({ title, text: content });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(content);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch {
      // Final fallback — do nothing
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={
          variant === 'full'
            ? 'flex items-center gap-1.5 rounded-lg bg-[#2a2a3a] px-3 py-1.5 text-[12px] text-[#8e8ea0] transition-all hover:bg-[#32324a] hover:text-white'
            : 'flex items-center justify-center rounded-lg p-1.5 text-[#5a5a72] transition-colors hover:text-amber-400'
        }
      >
        <svg className={variant === 'full' ? 'h-3 w-3' : 'h-3.5 w-3.5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {variant === 'full' && 'Share'}
      </button>

      {/* Toast */}
      {showToast && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-emerald-500/90 px-3 py-1.5 text-[11px] font-medium text-white shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
