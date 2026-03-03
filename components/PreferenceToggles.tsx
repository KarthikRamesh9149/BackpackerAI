'use client';

import { Preferences } from '@/lib/types';

interface PreferenceTogglesProps {
  preferences: Preferences;
  onChange: (prefs: Preferences) => void;
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-all ${
        active
          ? 'border-amber-500/60 bg-amber-500/15 text-amber-400'
          : 'border-[#3a3a4a] text-[#6e6e82] hover:border-[#5a5a6a] hover:text-[#9e9eb2]'
      }`}
    >
      {label}
    </button>
  );
}

export default function PreferenceToggles({
  preferences,
  onChange,
}: PreferenceTogglesProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-2 px-4 py-2.5 border-b border-[#2a2a38]">
      <span className="text-[11px] text-[#5a5a72] mr-1">Preferences:</span>

      <Pill label="Tight budget" active={preferences.budget === 'tight'} onClick={() => onChange({ ...preferences, budget: 'tight' })} />
      <Pill label="Normal budget" active={preferences.budget === 'normal'} onClick={() => onChange({ ...preferences, budget: 'normal' })} />
      <Pill label="Comfortable" active={preferences.budget === 'comfortable'} onClick={() => onChange({ ...preferences, budget: 'comfortable' })} />

      <span className="mx-1 text-[#3a3a4a]">·</span>

      <Pill label="Social vibe" active={preferences.vibe === 'social'} onClick={() => onChange({ ...preferences, vibe: 'social' })} />
      <Pill label="Chill vibe" active={preferences.vibe === 'chill'} onClick={() => onChange({ ...preferences, vibe: 'chill' })} />

      <span className="mx-1 text-[#3a3a4a]">·</span>

      <Pill label="Walk" active={preferences.walking === 'walk'} onClick={() => onChange({ ...preferences, walking: 'walk' })} />
      <Pill label="Transit" active={preferences.walking === 'transit'} onClick={() => onChange({ ...preferences, walking: 'transit' })} />
    </div>
  );
}
