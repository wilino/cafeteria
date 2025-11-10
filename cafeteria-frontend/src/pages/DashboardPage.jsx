/**
 * Dashboard Page
 * Main landing page with role-specific content
 */

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  Restaurant,
  Inventory,
  ShoppingCart,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { usersAPI, menuAPI, ingredientesAPI, pedidosAPI } from '../services/api.service';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.main`,
            borderRadius: '50%',
            p: 2,
            display: 'flex',
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { user, hasRole, hasAnyRole } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = {};

      if (hasAnyRole('admin', 'empleado')) {
        // Load admin/employee stats
        const [usersRes, menuRes, ingredientesRes, pedidosRes, lowStockRes] = await Promise.all([
          usersAPI.getAll().catch(() => ({ data: { pagination: { total: 0 } } })),
          menuAPI.getAll().catch(() => ({ data: { data: [] } })),
          ingredientesAPI.getAll().catch(() => ({ data: { data: [] } })),
          pedidosAPI.getAll().catch(() => ({ data: { data: [] } })),
          ingredientesAPI.getLowStock().catch(() => ({ data: { data: [] } })),
        ]);

        data.totalUsers = usersRes.data.pagination?.total || 0;
        data.totalMenu = menuRes.data.data?.length || 0;
        data.totalIngredientes = ingredientesRes.data.data?.length || 0;
        data.totalPedidos = pedidosRes.data.data?.length || 0;
        data.lowStockItems = lowStockRes.data.data?.length || 0;
      }

      if (hasRole('cliente')) {
        // Load customer stats
        const [menuRes, pedidosRes] = await Promise.all([
          menuAPI.getAll(),
          pedidosAPI.getAll(),
        ]);

        data.availableItems = menuRes.data.data?.filter((item) => item.disponible).length || 0;
        data.myOrders = pedidosRes.data.data?.length || 0;
      }

      setStats(data);
    } catch (err) {
      setError('Error al cargar datos del dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bienvenido, {user?.nombre}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Rol: <strong>{user?.role}</strong>
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {hasAnyRole('admin', 'empleado') && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Usuarios"
                value={stats.totalUsers}
                icon={<People />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Items Menú"
                value={stats.totalMenu}
                icon={<Restaurant />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Ingredientes"
                value={stats.totalIngredientes}
                icon={<Inventory />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pedidos Totales"
                value={stats.totalPedidos}
                icon={<ShoppingCart />}
                color="warning"
              />
            </Grid>
            {stats.lowStockItems > 0 && (
              <Grid item xs={12}>
                <Alert severity="warning" icon={<Warning />}>
                  <strong>{stats.lowStockItems}</strong> ingrediente(s) con stock bajo. 
                  Revisar en la sección de Inventario.
                </Alert>
              </Grid>
            )}
          </>
        )}

        {hasRole('cliente') && (
          <>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Items Disponibles"
                value={stats.availableItems}
                icon={<Restaurant />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard
                title="Mis Pedidos"
                value={stats.myOrders}
                icon={<ShoppingCart />}
                color="primary"
              />
            </Grid>
          </>
        )}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hasRole('admin') && 'Gestiona usuarios, inventario y pedidos desde el menú lateral.'}
              {hasRole('empleado') && 'Gestiona inventario, menú y procesa pedidos desde el menú lateral.'}
              {hasRole('cliente') && 'Explora el menú y realiza tus pedidos.'}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
