import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Overview } from './pages/Overview';
import { StyleGuide } from './pages/StyleGuide';
import { Instagram } from './pages/Instagram';
import { YouTube } from './pages/YouTube';
import { SoundCloud } from './pages/SoundCloud';
import { Studio } from './pages/Studio';
import { NotificationProvider } from './components/Notification';
import { Exports } from './pages/Exports';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="style-guide" element={<StyleGuide />} />
            <Route path="instagram" element={<Instagram />} />
            <Route path="youtube" element={<YouTube />} />
            <Route path="soundcloud" element={<SoundCloud />} />
            <Route path="studio" element={<Studio />} />
            <Route path="exports" element={<Exports />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
