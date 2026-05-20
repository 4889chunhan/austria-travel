import { useRef, useState } from 'react';
import { MapView, type MapViewHandle } from '../components/MapView';
import { MapFilterBar } from '../components/MapFilterBar';
import { MapSidebar } from '../components/MapSidebar';
import { RouteToggle } from '../components/MapControls';
import { useStore } from '../store';

export function MapPage() {
  const handleRef = useRef<MapViewHandle | null>(null);
  const [routeMode, setRouteMode] = useState(false);
  const itinerary = useStore((s) => s.itinerary);

  const flyTo = (lng: number, lat: number, zoom?: number) => {
    handleRef.current?.flyTo(lng, lat, zoom, true);
  };

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-cream">
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
    </div>
  );
}
