import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PlanPage } from './pages/PlanPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { MapPage } from './pages/MapPage';
import { AttractionDetailPage } from './pages/AttractionDetailPage';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <Routes>
      {/* Home is fullscreen + standalone — no Layout chrome. */}
      <Route path="/" element={<HomePage />} />

      {/* All other routes share the Layout header/footer. */}
      <Route element={<Layout />}>
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/attraction/:slug" element={<AttractionDetailPage />} />
      </Route>
    </Routes>
  );
}
