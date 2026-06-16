import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PlanPage } from './pages/PlanPage';
import { MapPage } from './pages/MapPage';
import { StaysPage } from './pages/StaysPage';
import { PhrasebookPage } from './pages/PhrasebookPage';
import { ChatPage } from './pages/ChatPage';
import { CollabPage } from './pages/CollabPage';
import { AttractionDetailPage } from './pages/AttractionDetailPage';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/stays" element={<StaysPage />} />
        <Route path="/phrasebook" element={<PhrasebookPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/collab/:id" element={<CollabPage />} />
        {/* /itinerary merged into /plan — keep old links working */}
        <Route path="/itinerary" element={<Navigate to="/plan" replace />} />
        <Route path="/attraction/:slug" element={<AttractionDetailPage />} />
      </Route>
    </Routes>
  );
}
