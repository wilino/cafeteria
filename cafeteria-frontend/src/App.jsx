import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MenuPage } from './pages/MenuPage';
import { PedidosPage } from './pages/PedidosPage';
import { InventarioPage } from './pages/InventarioPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { ProfilePage } from './pages/ProfilePage';
import { MFASetupPage } from './pages/MFASetupPage';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6f4e37', // Coffee brown
    },
    secondary: {
      main: '#d4a574', // Light coffee
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="pedidos" element={<PedidosPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="mfa-setup" element={<MFASetupPage />} />
              <Route 
                path="inventario" 
                element={
                  <ProtectedRoute requiredRoles={['admin', 'empleado']}>
                    <InventarioPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="usuarios" 
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <UsuariosPage />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

