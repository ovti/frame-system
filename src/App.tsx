import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ExportPage from './pages/ExportPage';
import FramesPage from './pages/FramesPage';
import GraphPage from './pages/GraphPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import RelationsPage from './pages/RelationsPage';
import './styles/App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='graph' element={<GraphPage />} />
        <Route path='frames' element={<FramesPage />} />
        <Route path='relations' element={<RelationsPage />} />
        <Route path='export' element={<ExportPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
