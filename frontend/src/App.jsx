import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './auth.jsx';
import ApplyPage from './pages/ApplyPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/apply" element={<ProtectedRoute><ApplyPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
    </Routes>
  );
}
