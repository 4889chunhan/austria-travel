import { useEffect, useMemo, useRef, useState } from 'react';
import MapGL, { ScaleControl, Source, Layer, type MapRef } from 'react-map-gl';
import type { Map as MapboxMap } from 'mapbox-gl';
import { attractions } from '../data/attractions';
import { useStore } from '../store';
import { AttractionMarker, CityClusterMarker } from './MapMarkers';
import { ZoomControls } from './MapControls';
import type { Attraction } from '../types';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const CLUSTER_BELOW_ZOOM = 8;

// Animated "marching ants" dash pattern. Mapbox doesn't support animated
// line-dashoffset, so we cycle the dash array values in a setInterval.
const DASH_SEQUENCE: number[][] = [
  [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5],
  [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0],
];

export type MapViewHandle = {
  flyTo: (lng: number, lat: number, zoom?: number, offsetLeft?: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

export function MapView({
  routeMode,
  onReady,
}: {
  routeMode: boolean;
  onReady?: (handle: MapViewHandle) => void;
}) {
  const mapRef = useRef<MapRef>(null);
  const [zoom, setZoom] = useState(7);

  const activeCategories = useStore((s) => s.activeCategories);
  const setSelectedAttraction = useStore((s) => s.setSelectedAttraction);
  const itinerary = useStore((s) => s.itinerary);

  const handleLoad = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    applyParchmentStyle(map);
  };

  // Build a flat ordered list of route stops + a lookup of route positions
  const { routeGeoJSON, routePositions } = useMemo(() => {
    if (!routeMode || itinerary.length === 0) {
      return { routeGeoJSON: null, routePositions: new Map<string, number>() };
    }
    const coords: [number, number][] = [];
    const positions = new Map<string, number>();
    let n = 0;
    for (const day of itinerary) {
      for (const a of day.attractions) {
        coords.push([a.coordinates.lng, a.coordinates.lat]);
        positions.set(a.id, ++n);
      }
    }
    if (coords.length < 2) {
      return { routeGeoJSON: null, routePositions: positions };
    }
    return {
      routeGeoJSON: {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: {},
            geometry: { type: 'LineString' as const, coordinates: coords },
          },
        ],
      },
      routePositions: positions,
    };
  }, [routeMode, itinerary]);

  // Cycle dash array for marching-ants effect while route is visible
  useEffect(() => {
    if (!routeGeoJSON) return;
    const map = mapRef.current?.getMap();
    if (!map) return;
    let step = 0;
    const id = window.setInterval(() => {
      step = (step + 1) % DASH_SEQUENCE.length;
      try {
        map.setPaintProperty('route-line', 'line-dasharray', DASH_SEQUENCE[step]);
      } catch {
        /* layer not added yet */
      }
    }, 75);
    return () => window.clearInterval(id);
  }, [routeGeoJSON]);

  // Compute city centroids for low-zoom cluster chips
  const cityClusters = useMemo(() => {
    const groups = new Map<string, { sum: [number, number]; count: number }>();
    for (const a of attractions) {
      const entry = groups.get(a.city) ?? { sum: [0, 0], count: 0 };
      entry.sum[0] += a.coordinates.lng;
      entry.sum[1] += a.coordinates.lat;
      entry.count += 1;
      groups.set(a.city, entry);
    }
    return Array.from(groups.entries()).map(([city, { sum, count }]) => ({
      city,
      count,
      center: [sum[0] / count, sum[1] / count] as [number, number],
    }));
  }, []);

  // Filter visibility
  const isVisible = (a: Attraction) =>
    activeCategories.length === 0 ||
    a.category.some((c) => activeCategories.includes(c));

  // Expose imperative API to parent
  useEffect(() => {
    if (!onReady) return;
    onReady({
      flyTo: (lng, lat, z = 12, offsetLeft = true) => {
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom: z,
          duration: 1200,
          offset: offsetLeft ? [-150, 0] : [0, 0],
        });
      },
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),
    });
  }, [onReady]);

  if (!TOKEN) {
    return <MissingTokenFallback />;
  }

  const showClusters = zoom < CLUSTER_BELOW_ZOOM;

  return (
    <div className="relative h-full w-full">
      <MapGL
        ref={mapRef}
        mapboxAccessToken={TOKEN}
        initialViewState={{
          longitude: 13.4,
          latitude: 47.8,
          zoom: 7,
          pitch: 0,
          bearing: 0,
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        style={{ width: '100%', height: '100%' }}
        onLoad={handleLoad}
        onZoom={(e) => setZoom(e.viewState.zoom)}
        onClick={() => setSelectedAttraction(null)}
      >
        {showClusters
          ? cityClusters.map((c) => (
              <CityClusterMarker
                key={c.city}
                city={c.city}
                count={c.count}
                center={c.center}
                onClick={() =>
                  mapRef.current?.flyTo({
                    center: c.center,
                    zoom: 10,
                    duration: 1400,
                  })
                }
              />
            ))
          : attractions.map((a) => (
              <AttractionMarker
                key={a.id}
                attraction={a}
                zoom={zoom}
                dimmed={!isVisible(a)}
                routeIndex={routePositions.get(a.id)}
                onClick={() => {
                  setSelectedAttraction(a);
                  mapRef.current?.flyTo({
                    center: [a.coordinates.lng, a.coordinates.lat],
                    zoom: Math.max(zoom, 11),
                    duration: 1100,
                    offset: [-150, 0],
                  });
                }}
              />
            ))}

        {routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#8FA882',
                'line-width': 3.5,
                'line-opacity': 0.85,
                'line-dasharray': [5, 3],
              }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
          </Source>
        )}

        <ScaleControl position="bottom-left" unit="metric" />
      </MapGL>

      <ZoomControls
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Parchment style overrides — applied on map load.
   Iterates over actual layers in the style instead of hardcoding IDs, since
   layer names in mapbox/outdoors-v12 don't all match the spec verbatim.
   --------------------------------------------------------------------------- */

function applyParchmentStyle(map: MapboxMap) {
  const trySet = (
    layerId: string,
    prop: string,
    value: unknown,
    method: 'paint' | 'layout' = 'paint',
  ) => {
    try {
      if (!map.getLayer(layerId)) return;
      if (method === 'paint') {
        map.setPaintProperty(layerId, prop as never, value as never);
      } else {
        map.setLayoutProperty(layerId, prop as never, value as never);
      }
    } catch {
      /* ignore — layer/style may differ across Mapbox style versions */
    }
  };

  // Background
  try {
    map.setPaintProperty('background', 'background-color', '#E8DFC8');
  } catch {
    /* */
  }

  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const id = layer.id;
    const type = layer.type;

    if (type === 'fill') {
      if (id === 'water' || /water/i.test(id)) {
        trySet(id, 'fill-color', '#A8C5C8');
      } else if (/national-park/i.test(id)) {
        trySet(id, 'fill-color', '#BDD4A8');
      } else if (/park|grass|meadow|recreation/i.test(id)) {
        trySet(id, 'fill-color', '#C5D4A8');
      } else if (/wood|forest/i.test(id)) {
        trySet(id, 'fill-color', '#B0C490');
      } else if (/building/i.test(id)) {
        trySet(id, 'fill-color', '#D4C9B0');
      } else if (/landuse|land-use/i.test(id)) {
        trySet(id, 'fill-color', '#D4CDB4');
      }
    } else if (type === 'line') {
      if (/waterway/i.test(id)) {
        trySet(id, 'line-color', '#8EAFB2');
      } else if (/road.*primary|motorway|trunk/i.test(id)) {
        trySet(id, 'line-color', '#C8B898');
        trySet(id, 'line-opacity', 0.6);
      } else if (/road/i.test(id)) {
        trySet(id, 'line-color', '#D4C4A4');
        trySet(id, 'line-opacity', 0.4);
      } else if (/admin/i.test(id)) {
        trySet(id, 'line-color', '#B09878');
        trySet(id, 'line-dasharray', [3, 2]);
        trySet(id, 'line-opacity', 0.5);
      }
    } else if (type === 'symbol') {
      // Tone down map text labels into the parchment palette
      trySet(id, 'text-color', '#5C4F3A');
      trySet(id, 'text-halo-color', '#E8DFC8');
      trySet(id, 'text-halo-width', 1.2);
    } else if (type === 'hillshade') {
      trySet(id, 'hillshade-shadow-color', '#C4B89A');
      trySet(id, 'hillshade-exaggeration', 0.45);
    }

    // Hide layers we don't want in the illustrated look
    if (/transit-label|bus-stop|aeroway|ferry/i.test(id)) {
      trySet(id, 'visibility', 'none', 'layout');
    }
  }
}

/* ---------------------------------------------------------------------------
   Fallback when no token is configured
   --------------------------------------------------------------------------- */

function MissingTokenFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-cream p-8">
      <div className="card max-w-md text-center">
        <p className="eyebrow mb-3">Setup required</p>
        <h2 className="font-serif text-2xl italic text-ink">
          Add your Mapbox token
        </h2>
        <p className="mt-4 font-chinese text-sm leading-relaxed text-ink-muted">
          Create a file{' '}
          <code className="rounded bg-cream px-1 font-mono text-xs">.env.local</code>{' '}
          in the project root with:
        </p>
        <pre className="mt-3 overflow-x-auto rounded bg-cream p-3 text-left font-mono text-xs text-ink">
          VITE_MAPBOX_TOKEN=pk.your_token_here
        </pre>
        <p className="mt-4 text-xs text-ink-faint">
          Get a free token at{' '}
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-deep underline"
          >
            mapbox.com
          </a>
          , then restart{' '}
          <code className="font-mono">npm run dev</code>.
        </p>
      </div>
    </div>
  );
}
