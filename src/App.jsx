import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider, FinanceContext } from './context/FinanceContext';

// Seus componentes
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import AlertSystem from './components/AlertSystem';
import Login from './components/LoginTemp'; // Mantido como você salvou
import Profile from './pages/Profile'; 

const PrivateRoute = ({ children }) => {
  const { user } = useContext(FinanceContext);
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => (
  <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
    <Sidebar />
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  </div>
);

function AppRoutes() {
  const { user, loading } = useContext(FinanceContext);

  // CORREÇÃO DA TELA BRANCA: Mostra loading visual
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Carregando AIVAFinance...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        
        <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
        <Route path="/relatorios" element={<PrivateRoute><AppLayout><Reports /></AppLayout></PrivateRoute>} />
        <Route path="/alertas" element={<PrivateRoute><AppLayout><AlertSystem /></AppLayout></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppRoutes />
    </FinanceProvider>
  );
}