import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TestScreen from './pages/TestScreen';
import ResultsScreen from './pages/ResultsScreen';
import HistoryScreen from './pages/HistoryScreen';
import CalibrationScreen from './pages/CalibrationScreen';
import SettingsScreen from './pages/SettingsScreen';
import AboutScreen from './pages/AboutScreen';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/test" element={<TestScreen />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/calibration" element={<CalibrationScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/about" element={<AboutScreen />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
