/**
 * Pedidos Page
 * View and manage orders based on user role
 */

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Cancel,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { pedidosAPI } from '../services/api.service';
import { statusColors, tableHeader, pageHeader } from '../styles/commonStyles';

const OrderRow = ({ pedido, onUpdate, canManage }) => {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newEstado, setNewEstado] = useState(pedido.estado);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleUpdateEstado = async () => {
    try {
      setUpdating(true);
      await pedidosAPI.updateEstado(pedido.id, newEstado);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    try {
      await pedidosAPI.cancel(pedido.id);
      onUpdate();
      setCancelDialogOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cancelar');
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>#{pedido.id}</TableCell>
        <TableCell>{pedido.cliente_nombre || 'N/A'}</TableCell>
        <TableCell>
          <Chip
            label={pedido.estado}
            color={statusColors[pedido.estado] || 'default'}
            size="small"
          />
        </TableCell>
        <TableCell>${parseFloat(pedido.total).toFixed(2)}</TableCell>
        <TableCell>
          {new Date(pedido.created_at).toLocaleString()}
        </TableCell>
        <TableCell>
          {canManage && pedido.estado === 'pendiente' && (
            <Button
              size="small"
              startIcon={<Cancel />}
              onClick={() => setCancelDialogOpen(true)}
              color="error"
            >
              Cancelar
            </Button>
          )}
          <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="xs">
            <DialogTitle>Cancelar Pedido</DialogTitle>
            <DialogContent>
              <Typography>
                ¿Estás seguro de que deseas cancelar el pedido #{pedido.id}?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
              <Button variant="contained" color="error" onClick={handleCancel}>
                Sí, Cancelar
              </Button>
            </DialogActions>
          </Dialog>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalles del Pedido
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio Unit.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedido.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell align="right">{item.cantidad}</TableCell>
                      <TableCell align="right">
                        ${parseFloat(item.precio_unitario).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ${parseFloat(item.subtotal).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {canManage && pedido.estado !== 'cancelado' && pedido.estado !== 'entregado' && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Cambiar Estado</InputLabel>
                    <Select
                      value={newEstado}
                      label="Cambiar Estado"
                      onChange={(e) => setNewEstado(e.target.value)}
                    >
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                      <MenuItem value="en_preparacion">En Preparación</MenuItem>
                      <MenuItem value="listo">Listo</MenuItem>
                      <MenuItem value="entregado">Entregado</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleUpdateEstado}
                    disabled={updating || newEstado === pedido.estado}
                  >
                    {updating ? 'Actualizando...' : 'Actualizar'}
                  </Button>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const PedidosPage = () => {
  const { user, hasAnyRole } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canManage = hasAnyRole('admin', 'empleado');

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const response = await pedidosAPI.getAll();
      
      // Load items for each pedido
      const pedidosWithItems = await Promise.all(
        response.data.data.map(async (pedido) => {
          try {
            const detailRes = await pedidosAPI.getById(pedido.id);
            return detailRes.data.data;
          } catch {
            return pedido;
          }
        })
      );

      setPedidos(pedidosWithItems);
      setError('');
    } catch (err) {
      setError('Error al cargar pedidos');
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
      <Box sx={pageHeader}>
        <Typography variant="h4">
          {canManage ? 'Gestión de Pedidos' : 'Mis Pedidos'}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {pedidos.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              No hay pedidos disponibles
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeader} />
                <TableCell sx={tableHeader}>ID</TableCell>
                <TableCell sx={tableHeader}>Cliente</TableCell>
                <TableCell sx={tableHeader}>Estado</TableCell>
                <TableCell sx={tableHeader}>Total</TableCell>
                <TableCell sx={tableHeader}>Fecha</TableCell>
                <TableCell sx={tableHeader}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <OrderRow
                  key={pedido.id}
                  pedido={pedido}
                  onUpdate={loadPedidos}
                  canManage={canManage}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
