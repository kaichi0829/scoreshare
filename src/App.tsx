import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import TopPage from './pages/TopPage';
import NewRoomPage from './pages/NewRoomPage';
import DashboardPage from './pages/DashboardPage';
import './global.css';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/new" element={<NewRoomPage />} />
          <Route path="/dashboard/:roomId" element={<DashboardPage />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
