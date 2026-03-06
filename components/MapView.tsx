'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useGeocoder } from '@/hooks/useGeocoder';
import { MapMarker, MARKER_COLORS, extractPlaceName, getCityCenter, getDefaultPins } from '@/lib/mapUtils';
import { ChatMessage } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// Invalidates Leaflet size on mount (handles absolute-positioned container)
// and re-centers when the city changes.
function MapInvalidator({ center }: { center: [number, number] }) {
  const map = useMap();
  const prevCenter = useRef<[number, number] | null>(null);

  useEffect(() => {
    // Always invalidate after mount — container may have been positioned
    // via opacity/pointer-events so Leaflet needs to re-measure.
    const frame = requestAnimationFrame(() => {
      map.invalidateSize({ animate: false });
      if (
        !prevCenter.current ||
        prevCenter.current[0] !== center[0] ||
        prevCenter.current[1] !== center[1]
      ) {
        map.setView(center, 13, { animate: false });
        prevCenter.current = center;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [center, map]);

  return null;
}

interface MapViewProps {
  messages: ChatMessage[];
  userCity: string | null;
  onClose: () => void;
  isVisible?: boolean; // kept for wrapper compat, unused internally
}

export default function MapView({ messages, userCity, onClose }: MapViewProps) {
  const [chatMarkers, setChatMarkers] = useState<MapMarker[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const { geocode } = useGeocoder(userCity);
  const center = useMemo(() => getCityCenter(userCity), [userCity]);
  const defaultPins = useMemo(() => getDefaultPins(userCity), [userCity]);

  // Extract place names from card bullets and geocode them
  useEffect(() => {
    const places: Array<{ name: string; type: MapMarker['type']; detail: string }> = [];

    for (const msg of messages) {
      if (!msg.cards) continue;
      for (const card of msg.cards) {
        for (const bullet of card.bullets) {
          const name = extractPlaceName(bullet);
          if (name) {
            places.push({ name, type: card.type, detail: bullet });
          }
        }
      }
    }

    if (places.length === 0) {
      setChatMarkers([]);
      return;
    }

    const toGeocode = places.slice(0, 20);
    let cancelled = false;
    setIsGeocoding(true);

    async function geocodePlaces() {
      const results: MapMarker[] = [];
      for (const place of toGeocode) {
        if (cancelled) break;
        const result = await geocode(place.name);
        if (result) {
          results.push({
            id: `chat-${place.name}-${results.length}`,
            name: place.name,
            lat: result.lat,
            lng: result.lng,
            type: place.type,
            detail: place.detail,
            isDefault: false,
          });
        }
      }
      if (!cancelled) {
        setChatMarkers(results);
        setIsGeocoding(false);
      }
    }

    geocodePlaces();
    return () => {
      cancelled = true;
      setIsGeocoding(false);
    };
  }, [messages, geocode]);

  const displayMarkers = chatMarkers.length > 0 ? chatMarkers : defaultPins;
  const showingDefaults = chatMarkers.length === 0;

  const legendItems = useMemo(() => {
    const types = new Set(displayMarkers.map((m) => m.type));
    return Array.from(types).map((t) => ({
      type: t,
      color: MARKER_COLORS[t],
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));
  }, [displayMarkers]);

  return (
    <div className="flex h-full w-full flex-col bg-[#12121e]">
      {/* Map header */}
      <div className="flex items-center justify-between border-b border-[#22223a] bg-[#15152a] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-sm font-medium text-white">
            {userCity ? `${userCity} Map` : 'Map View'}
          </span>
          <span className="text-xs text-[#6e6e82]">
            {displayMarkers.length} place{displayMarkers.length !== 1 ? 's' : ''}
            {showingDefaults && ' · popular spots'}
            {isGeocoding && ' · mapping...'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg bg-[#22223a] px-3 py-1.5 text-xs text-[#8e8ea0] transition-colors hover:text-white"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat
        </button>
      </div>

      {/* Map container — always full-height so Leaflet tiles load correctly */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          attributionControl={false}
        >
          <MapInvalidator center={center} />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {displayMarkers.map((marker) => (
            <CircleMarker
              key={marker.id}
              center={[marker.lat, marker.lng]}
              radius={marker.isDefault ? 9 : 10}
              pathOptions={{
                fillColor: MARKER_COLORS[marker.type],
                fillOpacity: marker.isDefault ? 0.75 : 0.95,
                color: '#fff',
                weight: marker.isDefault ? 1.5 : 2,
              }}
            >
              <Popup>
                <div className="min-w-[200px] max-w-[260px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="inline-block h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: MARKER_COLORS[marker.type] }}
                    />
                    <strong className="text-sm font-semibold">{marker.name}</strong>
                  </div>
                  {marker.detail && (
                    <p className="text-xs text-gray-600 leading-relaxed">{marker.detail}</p>
                  )}
                  {marker.isDefault && (
                    <p className="mt-1.5 text-[10px] text-gray-400 italic">Popular local spot</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Legend */}
        {legendItems.length > 0 && (
          <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-[#1a1a27]/95 border border-[#2a2a3a] px-3 py-2 backdrop-blur-sm">
            <p className="text-[10px] text-[#5a5a72] uppercase tracking-wider mb-1.5 font-medium">
              {showingDefaults ? 'Popular Spots' : 'From Chat'}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {legendItems.map((item) => (
                <div key={item.type} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-[#c8c8d8]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Geocoding indicator */}
        {isGeocoding && (
          <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 rounded-lg bg-[#1a1a27]/95 border border-[#2a2a3a] px-3 py-1.5">
            <div className="h-3 w-3 animate-spin rounded-full border border-amber-400 border-t-transparent" />
            <span className="text-[11px] text-[#8e8ea0]">Mapping places...</span>
          </div>
        )}
      </div>
    </div>
  );
}
