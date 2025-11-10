/**
 * Inventario Page
 * Manage ingredients and stock (Admin/Empleado only)
 */

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Warning,
  Inventory2,
} from '@mui/icons-material';
import { ingredientesAPI } from '../services/api.service';
import { useAuth } from '../context/AuthContext';
import { tableHeader, pageHeader } from '../styles/commonStyles';

export const InventarioPage = () => {
  const { hasRole } = useAuth();
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stockItem, setStockItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    unidad: '',
    cantidad_minima: '10',
  });
  const [stockAmount, setStockAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadIngredientes();
  }, []);

  const loadIngredientes = async () => {
    try {
      setLoading(true);
      const response = await ingredientesAPI.getAll();
      setIngredientes(response.data.data);
      setError('');
    } catch (err) {
      setError('Error al cargar inventario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nombre: item.nombre,
        cantidad: item.cantidad,
        unidad: item.unidad,
        cantidad_minima: item.cantidad_minima || '10',
      });
    } else {
      setEditingItem(null);
      setFormData({ nombre: '', cantidad: '', unidad: '', cantidad_minima: '10' });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = async () => {
    try {
      setSubmitting(true);
      if (editingItem) {
        await ingredientesAPI.update(editingItem.id, formData);
      } else {
        await ingredientesAPI.create(formData);
      }
      await loadIngredientes();
      handleCloseForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await ingredientesAPI.delete(itemToDelete.id);
      await loadIngredientes();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleOpenStockDialog = (item) => {
    setStockItem(item);
    setStockAmount('');
    setStockDialogOpen(true);
  };

  const handleUpdateStock = async () => {
    try {
      setSubmitting(true);
      await ingredientesAPI.updateStock(stockItem.id, parseFloat(stockAmount));
      await loadIngredientes();
      setStockDialogOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar stock');
    } finally {
      setSubmitting(false);
    }
  };

  const isLowStock = (item) => {
    return parseFloat(item.cantidad) < parseFloat(item.cantidad_minima || 10);
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
        <Typography variant="h4">Inventario</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
        >
          Agregar Ingrediente
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {ingredientes.filter(isLowStock).length > 0 && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          Hay {ingredientes.filter(isLowStock).length} ingrediente(s) con stock bajo
        </Alert>
      )}

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeader}>Nombre</TableCell>
              <TableCell sx={tableHeader} align="right">Cantidad</TableCell>
              <TableCell sx={tableHeader}>Unidad</TableCell>
              <TableCell sx={tableHeader}>Estado</TableCell>
              <TableCell sx={tableHeader} align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredientes.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell align="right">
                  {parseFloat(item.cantidad).toFixed(2)}
                </TableCell>
                <TableCell>{item.unidad}</TableCell>
                <TableCell>
                  {isLowStock(item) ? (
                    <Chip
                      label="Stock Bajo"
                      color="warning"
                      size="small"
                      icon={<Warning />}
                    />
                  ) : (
                    <Chip
                      label="Normal"
                      color="success"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenStockDialog(item)}
                    title="Actualizar Stock"
                  >
                    <Inventory2 />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenForm(item)}
                    title="Editar"
                  >
                    <Edit />
                  </IconButton>
                  {hasRole('admin') && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(item)}
                      title="Eliminar"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Cantidad"
            type="number"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
            margin="normal"
            required
            inputProps={{ step: '0.01', min: '0' }}
          />
          <TextField
            fullWidth
            label="Unidad"
            value={formData.unidad}
            onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
            margin="normal"
            required
            placeholder="kg, g, L, ml, unidad..."
          />
          <TextField
            fullWidth
            label="Cantidad Mínima (alerta)"
            type="number"
            value={formData.cantidad_minima}
            onChange={(e) => setFormData({ ...formData, cantidad_minima: e.target.value })}
            margin="normal"
            inputProps={{ step: '1', min: '0' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveItem}
            disabled={
              !formData.nombre ||
              !formData.cantidad ||
              !formData.unidad ||
              submitting
            }
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stock Update Dialog */}
      <Dialog
        open={stockDialogOpen}
        onClose={() => setStockDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Actualizar Stock</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {stockItem?.nombre}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Stock actual: {parseFloat(stockItem?.cantidad || 0).toFixed(2)} {stockItem?.unidad}
          </Typography>
          <TextField
            fullWidth
            label="Nueva Cantidad"
            type="number"
            value={stockAmount}
            onChange={(e) => setStockAmount(e.target.value)}
            margin="normal"
            required
            autoFocus
            inputProps={{ step: '0.01', min: '0' }}
            helperText="Ingresa la nueva cantidad total"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleUpdateStock}
            disabled={!stockAmount || submitting}
          >
            {submitting ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar{' '}
            <strong>{itemToDelete?.nombre}</strong> del inventario?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteItem}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
