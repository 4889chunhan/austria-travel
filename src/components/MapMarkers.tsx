import { useState } from 'react';
import { Marker } from 'react-map-gl';
import {
  BedDouble,
  Castle,
  Mountain as MountainIcon,
  type LucideIcon,
} from 'lucide-react';
import type { Accommodation, Attraction } from '../types';
import { useStore } from '../store';
import { primaryCategory } from '../utils/categoryColors';
import { useLocalizedField } from '../hooks/useLocalizedField';
import { cn } from '../utils/cn';
import { CITY_DISPLAY } from '../utils/cityDisplay';

/** Muted purple — distinct from every attraction category color. */
export const ACCOMMODATION_COLOR = '#8B6F9B';

/* ---------------------------------------------------------------------------
   Attraction teardrop pin
   --------------------------------------------------------------------------- */

export function AttractionMarker({
  attraction,
  onClick,
  routeIndex,
  zoom,
}: {
  attraction: Attraction;
  onClick: () => void;
  routeIndex?: number;
  zoom: number;
}) {
  const selectedId = useStore((s) => s.selectedAttraction?.id);
  const hoveredId = useStore((s) => s.hoveredAttraction);
  const setHovered = useStore((s) => s.setHoveredAttraction);
  const localized = useLocalizedField();

  const meta = primaryCategory(attraction.category);
  const selected = selectedId === attraction.id;
  const hovered = hoveredId === attraction.id;
  const showLabel = zoom >= 10 || selected || hovered;

  return (
    <Marker
      longitude={attraction.coordinates.lng}
      latitude={attraction.coordinates.lat}
      anchor="bottom"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setHovered(attraction.id)}
        onMouseLeave={() => setHovered(null)}
        className="relative cursor-pointer"
        style={{ transform: 'translateY(0)' }}
        role="button"
        aria-label={`${localized(attraction.name)} — 點擊查看詳情`}
      >
        {/* Pulsing halo behind selected pin */}
        {selected && (
          <div
            className="marker-pulse absolute rounded-pill"
            style={{
              left: '50%',
              top: '40%',
              width: 48,
              height: 48,
              marginLeft: -24,
              marginTop: -24,
              background: meta.color,
            }}
          />
        )}

        <div
          key={selected ? 'selected' : 'idle'}
          className={cn(
            'relative transition-transform duration-200',
            selected && 'marker-bounce',
          )}
          style={{
            transform: selected
              ? 'scale(1.3)'
              : hovered
              ? 'scale(1.18)'
              : 'scale(1)',
            transformOrigin: 'center bottom',
          }}
        >
          <TeardropPin color={meta.color} icon={meta.icon} ring={selected} />

          {/* Numbered route badge */}
          {routeIndex !== undefined && (
            <div
              className="absolute flex items-center justify-center rounded-pill font-mono text-[10px] font-bold text-lime-deep shadow-card"
              style={{
                top: -6,
                right: -6,
                width: 22,
                height: 22,
                background: 'var(--color-lime)',
                border: '1.5px solid white',
              }}
            >
              {routeIndex}
            </div>
          )}
        </div>

        {/* Name label chip */}
        {showLabel && (
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-white px-2 py-0.5 font-chinese text-[10px] font-medium text-ink"
            style={{
              top: 'calc(100% + 2px)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
              maxWidth: 140,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {localized(attraction.name)}
          </div>
        )}
      </div>
    </Marker>
  );
}

/* ---------------------------------------------------------------------------
   Teardrop SVG
   --------------------------------------------------------------------------- */

function TeardropPin({
  color,
  icon: Icon,
  ring,
}: {
  color: string;
  icon: LucideIcon;
  ring: boolean;
}) {
  return (
    <div className="relative" style={{ width: 32, height: 40 }}>
      <svg
        width="32"
        height="40"
        viewBox="0 0 32 40"
        style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.22))' }}
      >
        <path
          d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z"
          fill={color}
          stroke={ring ? '#FFFFFF' : 'none'}
          strokeWidth={ring ? 2.5 : 0}
        />
        <circle cx="16" cy="16" r="9" fill="white" opacity="0.95" />
      </svg>
      <div
        className="pointer-events-none absolute"
        style={{ top: 10, left: 10 }}
      >
        <Icon size={12} color={color} strokeWidth={2.4} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Accommodation teardrop pin (purple, white BedDouble icon)
   --------------------------------------------------------------------------- */

export function AccommodationMarker({
  accommodation,
  onClick,
  zoom,
}: {
  accommodation: Accommodation;
  onClick: () => void;
  zoom: number;
}) {
  const selectedId = useStore((s) => s.selectedAccommodation?.id);
  const localized = useLocalizedField();
  const [hovered, setHovered] = useState(false);

  const selected = selectedId === accommodation.id;
  const showLabel = zoom >= 11 || selected || hovered;

  return (
    <Marker
      longitude={accommodation.coordinates.lng}
      latitude={accommodation.coordinates.lat}
      anchor="bottom"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative cursor-pointer"
        role="button"
        aria-label={localized(accommodation.name)}
      >
        {selected && (
          <div
            className="marker-pulse absolute rounded-pill"
            style={{
              left: '50%',
              top: '40%',
              width: 48,
              height: 48,
              marginLeft: -24,
              marginTop: -24,
              background: ACCOMMODATION_COLOR,
            }}
          />
        )}

        <div
          key={selected ? 'selected' : 'idle'}
          className={cn(
            'relative transition-transform duration-200',
            selected && 'marker-bounce',
          )}
          style={{
            transform: selected
              ? 'scale(1.3)'
              : hovered
              ? 'scale(1.18)'
              : 'scale(1)',
            transformOrigin: 'center bottom',
          }}
        >
          <AccommodationTeardropPin ring={selected} />
        </div>

        {showLabel && (
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-white px-2 py-0.5 font-chinese text-[10px] font-medium text-ink"
            style={{
              top: 'calc(100% + 2px)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
              maxWidth: 140,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {localized(accommodation.name)}
          </div>
        )}
      </div>
    </Marker>
  );
}

function AccommodationTeardropPin({ ring }: { ring: boolean }) {
  return (
    <div className="relative" style={{ width: 32, height: 40 }}>
      <svg
        width="32"
        height="40"
        viewBox="0 0 32 40"
        style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.22))' }}
      >
        <path
          d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z"
          fill={ACCOMMODATION_COLOR}
          stroke={ring ? '#FFFFFF' : 'none'}
          strokeWidth={ring ? 2.5 : 0}
        />
      </svg>
      <div className="pointer-events-none absolute" style={{ top: 8, left: 10 }}>
        <BedDouble size={12} color="#FFFFFF" strokeWidth={2.2} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   City cluster chip (shown at low zoom)
   --------------------------------------------------------------------------- */

const CITY_LANDMARK: Record<string, LucideIcon> = {
  vienna: Castle,
  salzburg: Castle,
  hallstatt: MountainIcon,
  innsbruck: MountainIcon,
  graz: Castle,
  durnstein: Castle,
  melk: Castle,
  wolfgangsee: MountainIcon,
  gosau: MountainIcon,
  konigssee: MountainIcon,
  munich: Castle,
  neuschwanstein: Castle,
  regensburg: Castle,
  prague: Castle,
  'cesky-krumlov': Castle,
};

export function CityClusterMarker({
  city,
  count,
  center,
  onClick,
}: {
  city: string;
  count: number;
  center: [number, number];
  onClick: () => void;
}) {
  const Icon = CITY_LANDMARK[city] ?? Castle;
  const label = CITY_DISPLAY[city] ?? { zh: city, en: city };
  const localized = useLocalizedField();

  return (
    <Marker longitude={center[0]} latitude={center[1]} anchor="center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="flex items-center gap-2 rounded-pill bg-white px-3 py-1.5 shadow-card transition hover:shadow-hover"
        style={{ border: '0.5px solid var(--color-border)' }}
      >
        <Icon size={18} className="text-lime-deep" strokeWidth={1.8} />
        <span className="font-serif text-[13px] font-semibold text-ink">
          {localized(label)}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
          · {count}個景點
        </span>
      </button>
    </Marker>
  );
}
