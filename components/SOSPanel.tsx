'use client';

import { useState, useEffect } from 'react';
import {
  EMERGENCY_NUMBERS,
  EMBASSY_DATA,
  CITY_SCAMS,
  WILDLIFE_SAFETY,
} from '@/lib/emergencyData';

interface SOSPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userCity: string | null;
}

const NATIONALITIES = Object.keys(EMBASSY_DATA).sort();

export default function SOSPanel({ isOpen, onClose, userCity }: SOSPanelProps) {
  const [nationality, setNationality] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>('emergency');

  // Load nationality from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('backpackbuddy-nationality');
    if (saved) setNationality(saved);
  }, []);

  const handleNationalityChange = (nat: string) => {
    setNationality(nat);
    localStorage.setItem('backpackbuddy-nationality', nat);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Get city-specific scams
  const cityKey = userCity ? Object.keys(CITY_SCAMS).find(
    (k) => k.toLowerCase() === userCity.toLowerCase()
  ) : null;
  const scams = cityKey ? CITY_SCAMS[cityKey] : null;

  const embassy = nationality ? EMBASSY_DATA[nationality] : null;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-[#1a1a27] shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2a2a3a] bg-[#1a1a27] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/20">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Emergency Help</h2>
              <p className="text-xs text-[#6e6e82]">Safety info for Australia</p>
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

        <div className="px-5 py-4 space-y-3">
          {/* === Emergency Numbers === */}
          <section>
            <button
              onClick={() => toggleSection('emergency')}
              className="flex w-full items-center justify-between rounded-xl bg-red-500/10 px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-red-400">
                <span className="text-base">🚨</span> Emergency Numbers
              </span>
              <svg className={`h-4 w-4 text-red-400/60 transition-transform ${openSection === 'emergency' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSection === 'emergency' && (
              <div className="mt-2 space-y-2 px-1">
                {EMERGENCY_NUMBERS.map((num) => (
                  <a
                    key={num.number}
                    href={`tel:${num.number.replace(/\s/g, '')}`}
                    className="flex items-center justify-between rounded-xl border border-[#2a2a3a] bg-[#22223a] px-4 py-3 transition-colors active:bg-[#2a2a4a]"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#ececf1]">{num.label}</p>
                      <p className="text-xs text-[#6e6e82]">{num.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-emerald-400">{num.number}</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                        <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* === Nearest Hospital === */}
          <section>
            <button
              onClick={() => toggleSection('hospital')}
              className="flex w-full items-center justify-between rounded-xl bg-blue-500/10 px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-blue-400">
                <span className="text-base">🏥</span> Nearest Hospital
              </span>
              <svg className={`h-4 w-4 text-blue-400/60 transition-transform ${openSection === 'hospital' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSection === 'hospital' && (
              <div className="mt-2 px-1">
                <a
                  href="https://www.google.com/maps/search/hospital+near+me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-[#2a2a3a] bg-[#22223a] px-4 py-4 transition-colors active:bg-[#2a2a4a]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                    <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#ececf1]">Find Nearest Hospital</p>
                    <p className="text-xs text-[#6e6e82]">Opens Google Maps with hospitals near your location</p>
                  </div>
                  <svg className="h-4 w-4 text-[#5a5a72]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </section>

          {/* === Embassy / Consulate === */}
          <section>
            <button
              onClick={() => toggleSection('embassy')}
              className="flex w-full items-center justify-between rounded-xl bg-purple-500/10 px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-purple-400">
                <span className="text-base">🏛️</span> Embassy / Consulate
              </span>
              <svg className={`h-4 w-4 text-purple-400/60 transition-transform ${openSection === 'embassy' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSection === 'embassy' && (
              <div className="mt-2 space-y-3 px-1">
                <select
                  value={nationality || ''}
                  onChange={(e) => handleNationalityChange(e.target.value)}
                  className="w-full rounded-xl border border-[#3a3a52] bg-[#22223a] px-4 py-3 text-sm text-[#ececf1] outline-none focus:border-purple-500/50"
                  style={{ fontSize: '16px' }}
                >
                  <option value="" disabled>Select your nationality...</option>
                  {NATIONALITIES.map((nat) => (
                    <option key={nat} value={nat}>{nat}</option>
                  ))}
                </select>

                {embassy && (
                  <div className="rounded-xl border border-[#2a2a3a] bg-[#22223a] p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-[#ececf1]">{embassy.name}</h4>
                    <p className="text-xs text-[#6e6e82]">{embassy.city}, Australia</p>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${embassy.phone.replace(/[\s()]/g, '')}`}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-500/15 px-3 py-2.5 text-xs font-medium text-purple-400 transition-colors active:bg-purple-500/25"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call {embassy.phone}
                      </a>
                    </div>
                    {embassy.emergency !== embassy.phone && (
                      <a
                        href={`tel:${embassy.emergency.replace(/[\s()]/g, '')}`}
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-500/15 px-3 py-2.5 text-xs font-medium text-red-400 transition-colors active:bg-red-500/25"
                      >
                        After-hours Emergency: {embassy.emergency}
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* === City Scam Warnings === */}
          <section>
            <button
              onClick={() => toggleSection('scams')}
              className="flex w-full items-center justify-between rounded-xl bg-amber-500/10 px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-amber-400">
                <span className="text-base">⚠️</span> Scam Warnings{cityKey ? ` — ${cityKey}` : ''}
              </span>
              <svg className={`h-4 w-4 text-amber-400/60 transition-transform ${openSection === 'scams' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSection === 'scams' && (
              <div className="mt-2 px-1">
                {scams ? (
                  <div className="space-y-2">
                    {scams.map((scam, i) => (
                      <div key={i} className="flex gap-3 rounded-xl border border-[#2a2a3a] bg-[#22223a] px-4 py-3">
                        <span className="mt-0.5 text-amber-400/70 text-sm">!</span>
                        <p className="text-[13px] text-[#c8c8d8] leading-relaxed">{scam}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#2a2a3a] bg-[#22223a] px-4 py-4">
                    <p className="text-sm text-[#6e6e82]">
                      {userCity
                        ? `No specific scam warnings for ${userCity} yet. Stay alert and trust your instincts.`
                        : 'Select a city to see local scam warnings.'}
                    </p>
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs font-medium text-[#8e8ea0]">General tips:</p>
                      <p className="text-xs text-[#6e6e82]">- Never pay for a job or accommodation upfront without seeing it</p>
                      <p className="text-xs text-[#6e6e82]">- Use official taxi ranks or rideshare apps only</p>
                      <p className="text-xs text-[#6e6e82]">- If a deal seems too good to be true, it probably is</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* === Wildlife Safety === */}
          <section>
            <button
              onClick={() => toggleSection('wildlife')}
              className="flex w-full items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold text-emerald-400">
                <span className="text-base">🦎</span> Wildlife Safety
              </span>
              <svg className={`h-4 w-4 text-emerald-400/60 transition-transform ${openSection === 'wildlife' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openSection === 'wildlife' && (
              <div className="mt-2 space-y-2 px-1">
                {WILDLIFE_SAFETY.map((animal) => (
                  <div key={animal.animal} className="rounded-xl border border-[#2a2a3a] bg-[#22223a] px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{animal.icon}</span>
                      <h4 className="text-sm font-medium text-[#ececf1]">{animal.animal}</h4>
                    </div>
                    <p className="text-xs text-red-400/80 mb-1">{animal.danger}</p>
                    <p className="text-[13px] text-[#c8c8d8] leading-relaxed mb-1">{animal.action}</p>
                    <p className="text-[11px] text-[#5a5a72]">{animal.region}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Bottom padding for safe area */}
        <div className="h-8 safe-bottom" />
      </div>
    </>
  );
}
