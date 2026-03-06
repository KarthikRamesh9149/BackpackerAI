'use client';

import { useState, useMemo } from 'react';
import { SLANG_TERMS, SLANG_CATEGORIES, CULTURE_TIPS } from '@/lib/slangData';

interface SlangGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SlangGuide({ isOpen, onClose }: SlangGuideProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'slang' | 'culture'>('slang');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let terms = SLANG_TERMS;

    // Remove duplicates by term
    const seen = new Set<string>();
    terms = terms.filter((t) => {
      const key = t.term.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (search.trim()) {
      const q = search.toLowerCase();
      terms = terms.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.meaning.toLowerCase().includes(q)
      );
    }
    if (activeCategory) {
      terms = terms.filter((t) => t.category === activeCategory);
    }
    return terms;
  }, [search, activeCategory]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden rounded-t-2xl bg-[#1a1a27] shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-[#2a2a3a] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇦🇺</span>
            <div>
              <h2 className="text-lg font-bold text-white">Aussie Guide</h2>
              <p className="text-xs text-[#6e6e82]">Slang & culture tips</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#6e6e82] transition-colors hover:bg-[#2a2a3a] hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex border-b border-[#2a2a3a] px-5">
          <button
            onClick={() => setActiveTab('slang')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'slang'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-[#6e6e82] hover:text-white'
            }`}
          >
            Slang ({filtered.length})
          </button>
          <button
            onClick={() => setActiveTab('culture')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'culture'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-[#6e6e82] hover:text-white'
            }`}
          >
            Culture Tips
          </button>
        </div>

        {activeTab === 'slang' && (
          <>
            {/* Search */}
            <div className="flex-shrink-0 px-5 py-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search slang... (e.g. arvo, brekkie)"
                className="w-full rounded-xl border border-[#3a3a52] bg-[#22223a] px-4 py-2.5 text-sm text-[#ececf1] outline-none focus:border-amber-500/50"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Category filters */}
            <div className="flex-shrink-0 flex gap-2 overflow-x-auto px-5 pb-3 scrollbar-hide">
              <button
                onClick={() => setActiveCategory(null)}
                className={`flex-shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
                  !activeCategory
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-[#22223a] text-[#6e6e82] hover:text-white'
                }`}
              >
                All
              </button>
              {SLANG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`flex-shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
                    activeCategory === cat
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-[#22223a] text-[#6e6e82] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {activeTab === 'slang' ? (
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#6e6e82]">No slang found for &ldquo;{search}&rdquo;</p>
              ) : (
                filtered.map((term, i) => (
                  <div key={`${term.term}-${i}`} className="rounded-xl border border-[#2a2a3a] bg-[#22223a] px-4 py-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-bold text-amber-400">{term.term}</h4>
                      <span className="text-[10px] text-[#5a5a72]">{term.category}</span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-[#ececf1]">{term.meaning}</p>
                    <p className="mt-1 text-[12px] italic text-[#6e6e82]">&ldquo;{term.example}&rdquo;</p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2 pt-3">
              {CULTURE_TIPS.map((tip) => (
                <div key={tip.title} className="rounded-xl border border-[#2a2a3a] bg-[#22223a] px-4 py-3">
                  <h4 className="text-sm font-semibold text-amber-400">{tip.title}</h4>
                  <p className="mt-1 text-[13px] text-[#c8c8d8] leading-relaxed">{tip.tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 safe-bottom flex-shrink-0" />
      </div>
    </>
  );
}
