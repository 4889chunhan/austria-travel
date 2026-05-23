import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { MapView, type MapViewHandle } from '../components/MapView';
import { MapFilterBar } from '../components/MapFilterBar';
import { MapSidebar } from '../components/MapSidebar';
import { RouteToggle } from '../components/MapControls';
import { LanguageCardDeck } from '../components/LanguageCardDeck';
import { useStore } from '../store';

export function MapPage() {
  const handleRef = useRef<MapViewHandle | null>(null);
  const [routeMode, setRouteMode] = useState(false);

  const itinerary = useStore((s) => s.itinerary);
  const selectedAttraction = useStore((s) => s.selectedAttraction);
  const languageCardsOpen = useStore((s) => s.languageCardsOpen);
  const setLanguageCardsOpen = useStore((s) => s.setLanguageCardsOpen);

  const flyTo = (lng: number, lat: number, zoom?: number) => {
    handleRef.current?.flyTo(lng, lat, zoom, true);
  };

  const showCardsPanel = languageCardsOpen && selectedAttraction !== null;

  return (
    // h-full fills the Layout's content area; overflow-hidden keeps the map
    // pinned so only the sidebar (and the cards panel) scroll internally.
    <div className="relative h-full w-full overflow-hidden bg-cream">
      <MapView
        routeMode={routeMode}
        onReady={(handle) => {
          handleRef.current = handle;
        }}
      />
      <MapFilterBar />
      <RouteToggle
        enabled={itinerary.length > 0}
        active={routeMode}
        onToggle={() => setRouteMode((v) => !v)}
      />
      <MapSidebar onFlyTo={flyTo} />

      {/* Floating language-cards panel — right side, below the route toggle */}
      {showCardsPanel && selectedAttraction && (
        <div
          className="absolute z-40 flex flex-col"
          style={{
            top: 110,
            right: 16,
            width: 340,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100% - 126px)',
          }}
        >
          <div className="card flex flex-col overflow-y-auto">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-serif text-[20px] italic leading-tight text-ink">
                  語言小卡
                </h3>
                <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-editorial text-ink-faint">
                  {selectedAttraction.name.zh}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLanguageCardsOpen(false)}
                aria-label="關閉語言小卡"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill text-ink-muted transition hover:bg-cream hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {selectedAttraction.languageCards.length > 0 ? (
              <LanguageCardDeck cards={selectedAttraction.languageCards} />
            ) : (
              <p className="py-6 text-center font-chinese text-[13px] text-ink-faint">
                這個景點還沒有語言小卡。
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
