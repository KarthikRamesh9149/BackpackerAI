'use client';

import { useState, useMemo } from 'react';

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
];

const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 200];

interface CurrencyConverterProps {
  isOpen: boolean;
  onClose: () => void;
  rates: Record<string, number> | null;
  homeCurrency: string;
  onChangeHomeCurrency: (code: string) => void;
  convert: (aud: number) => string | null;
  isLoading: boolean;
}

export default function CurrencyConverter({
  isOpen,
  onClose,
  rates,
  homeCurrency,
  onChangeHomeCurrency,
  convert,
  isLoading,
}: CurrencyConverterProps) {
  const [audInput, setAudInput] = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const homeCurrencyInfo = POPULAR_CURRENCIES.find((c) => c.code === homeCurrency);
  const homeSymbol = homeCurrencyInfo?.symbol || homeCurrency;

  const convertedValue = useMemo(() => {
    const num = parseFloat(audInput);
    if (isNaN(num) || num <= 0) return null;
    return convert(num);
  }, [audInput, convert]);

  const quickConversions = useMemo(() => {
    return QUICK_AMOUNTS.map((amt) => ({
      aud: amt,
      converted: convert(amt),
    }));
  }, [convert]);

  const filteredCurrencies = useMemo(() => {
    if (!pickerSearch.trim()) return POPULAR_CURRENCIES;
    const q = pickerSearch.toLowerCase();
    return POPULAR_CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    );
  }, [pickerSearch]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl bg-[#1a1a27] shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-[#2a2a3a] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-lg">
              💱
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Currency Converter</h2>
              <p className="text-xs text-[#6e6e82]">AUD to {homeCurrency}</p>
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

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
              <span className="ml-3 text-sm text-[#6e6e82]">Loading rates...</span>
            </div>
          ) : (
            <>
              {/* Home Currency Selector */}
              <button
                onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
                className="mb-4 flex w-full items-center justify-between rounded-xl border border-[#3a3a52] bg-[#22223a] px-4 py-3 transition-colors hover:border-amber-500/30"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6e6e82]">My currency:</span>
                  <span className="font-semibold text-amber-400">{homeSymbol} {homeCurrency}</span>
                  {homeCurrencyInfo && (
                    <span className="text-xs text-[#6e6e82]">{homeCurrencyInfo.name}</span>
                  )}
                </div>
                <svg className={`h-4 w-4 text-[#6e6e82] transition-transform ${showCurrencyPicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Currency Picker Dropdown */}
              {showCurrencyPicker && (
                <div className="mb-4 rounded-xl border border-[#3a3a52] bg-[#22223a] overflow-hidden">
                  <div className="p-3">
                    <input
                      type="text"
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      placeholder="Search currency..."
                      className="w-full rounded-lg border border-[#3a3a52] bg-[#1a1a27] px-3 py-2 text-sm text-[#ececf1] outline-none focus:border-amber-500/50"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          onChangeHomeCurrency(c.code);
                          setShowCurrencyPicker(false);
                          setPickerSearch('');
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#2a2a3a] ${
                          homeCurrency === c.code ? 'bg-amber-500/10 text-amber-400' : 'text-[#c8c8d8]'
                        }`}
                      >
                        <span className="w-8 font-mono text-xs text-[#6e6e82]">{c.symbol}</span>
                        <span className="font-medium">{c.code}</span>
                        <span className="text-xs text-[#6e6e82]">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Converter */}
              <div className="mb-5 rounded-2xl border border-[#2a2a3a] bg-[#22223a] p-4">
                <div className="flex items-center gap-3">
                  {/* AUD Input */}
                  <div className="flex-1">
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[#6e6e82]">
                      AUD
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#6e6e82]">$</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={audInput}
                        onChange={(e) => setAudInput(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-[#3a3a52] bg-[#1a1a27] py-3 pl-8 pr-3 text-xl font-semibold text-white outline-none focus:border-amber-500/50"
                        style={{ fontSize: '20px' }}
                      />
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center self-end rounded-full bg-amber-500/15 text-amber-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* Converted */}
                  <div className="flex-1">
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-[#6e6e82]">
                      {homeCurrency}
                    </label>
                    <div className="rounded-xl border border-[#3a3a52] bg-[#1a1a27] py-3 px-3 text-xl font-semibold min-h-[52px] flex items-center">
                      {convertedValue ? (
                        <span className="text-emerald-400">{homeSymbol}{convertedValue}</span>
                      ) : (
                        <span className="text-[#3a3a52]">{homeSymbol}0.00</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Conversions */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#6e6e82]">
                  Quick Reference
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {quickConversions.map(({ aud, converted }) => (
                    <button
                      key={aud}
                      onClick={() => setAudInput(String(aud))}
                      className="rounded-xl border border-[#2a2a3a] bg-[#22223a] px-3 py-2.5 text-center transition-colors hover:border-amber-500/30"
                    >
                      <div className="text-xs text-[#6e6e82]">A${aud}</div>
                      <div className="mt-0.5 text-sm font-semibold text-amber-400">
                        {converted ? `${homeSymbol}${converted}` : '—'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rate Info */}
              {rates && rates[homeCurrency] && (
                <div className="rounded-xl border border-[#2a2a3a] bg-[#22223a] px-4 py-3">
                  <p className="text-center text-xs text-[#6e6e82]">
                    1 AUD = {homeSymbol}{rates[homeCurrency].toFixed(4)} {homeCurrency}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="h-4 safe-bottom flex-shrink-0" />
      </div>
    </>
  );
}
