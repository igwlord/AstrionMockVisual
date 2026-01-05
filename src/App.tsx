import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Overview } from './pages/Overview';
import { StyleGuide } from './pages/StyleGuide';
import { Instagram } from './pages/Instagram';
import { YouTube } from './pages/YouTube';
import { SoundCloud } from './pages/SoundCloud';
import { UploadMatrix } from './components/UploadMatrix';
import { Exports } from './pages/Exports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="style-guide" element={<StyleGuide />} />
          <Route path="instagram" element={<Instagram />} />
          <Route path="youtube" element={<YouTube />} />
          <Route path="soundcloud" element={<SoundCloud />} />
          <Route path="exports" element={<Exports />} />
          <Route path="upload-matrix" element={<UploadMatrix />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
