/**
 * Menu Page
 * Display menu items and allow ordering (for clients) or CRUD (for staff)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Badge,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ShoppingCart,
  Remove,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { menuAPI, pedidosAPI } from '../services/api.service';
import { cardBase, pageHeader, modalStyle } from '../styles/commonStyles';
import { v4 as uuidv4 } from 'uuid';

export const MenuPage = () => {
  const { user, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cart, setCart] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccessOpen, setOrderSuccessOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    disponible: true,
  });

  const canManage = hasAnyRole('admin', 'empleado');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAll();
      setMenuItems(response.data.data);
      setError('');
    } catch (err) {
      setError('Error al cargar el menú');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      setCart(cart.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i)));
    } else {
      setCart([...cart, { ...item, cantidad: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map((i) => (i.id === itemId ? { ...i, cantidad } : i)));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + parseFloat(item.precio) * item.cantidad, 0);
  };

  const handleSubmitOrder = async () => {
    try {
      setSubmitting(true);
      const idempotencyKey = uuidv4();
      const orderData = {
        items: cart.map((item) => ({
          menuId: item.id,
          cantidad: item.cantidad,
        })),
      };

      const response = await pedidosAPI.create(orderData, idempotencyKey);
      
      setCart([]);
      setCartOpen(false);
      setOrderNumber(response.data.data.id);
      setOrderSuccessOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear pedido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        precio: item.precio,
        categoria: item.categoria || '',
        disponible: item.disponible,
      });
    } else {
      setEditingItem(null);
      setFormData({ nombre: '', descripcion: '', precio: '', categoria: '', disponible: true });
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = async () => {
    // Validación de campos
    if (!formData.nombre || formData.nombre.trim() === '') {
      setError('El nombre es obligatorio');
      return;
    }
    if (!formData.categoria || formData.categoria.trim() === '') {
      setError('La categoría es obligatoria');
      return;
    }
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      if (editingItem) {
        await menuAPI.update(editingItem.id, formData);
        setSuccess('Item del menú actualizado correctamente');
      } else {
        await menuAPI.create(formData);
        setSuccess('Item del menú creado correctamente');
      }
      await loadMenuItems();
      handleCloseForm();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al guardar';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await menuAPI.delete(itemToDelete.id);
      await loadMenuItems();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setSuccess('Item del menú eliminado correctamente');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar';
      setError(errorMsg);
    }
  };

  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
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
        <Typography variant="h4">Menú</Typography>
        {canManage && (
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
            Agregar Item
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={cardBase}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.nombre}
                </Typography>
                {item.descripcion && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.descripcion}
                  </Typography>
                )}
                <Typography variant="h6" color="primary">
                  ${parseFloat(item.precio).toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                {!canManage ? (
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    disabled={!item.disponible}
                    onClick={() => addToCart(item)}
                  >
                    {item.disponible ? 'Agregar' : 'No Disponible'}
                  </Button>
                ) : (
                  <>
                    <IconButton size="small" color="primary" onClick={() => handleOpenForm(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(item)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Floating Cart Button */}
      {!canManage && cart.length > 0 && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setCartOpen(true)}
        >
          <Badge badgeContent={cart.length} color="error">
            <ShoppingCart />
          </Badge>
        </Fab>
      )}

      {/* Cart Dialog */}
      <Dialog open={cartOpen} onClose={() => setCartOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mi Carrito</DialogTitle>
        <DialogContent>
          {cart.length === 0 ? (
            <Typography color="text.secondary">El carrito está vacío</Typography>
          ) : (
            <>
              <List>
                {cart.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={item.nombre}
                      secondary={`$${parseFloat(item.precio).toFixed(2)} x ${item.cantidad}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <IconButton size="small" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>
                        <Remove />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.cantidad}</Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item.id, item.cantidad + 1)}>
                        <Add />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" align="right">
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCartOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmitOrder}
            disabled={cart.length === 0 || submitting}
          >
            {submitting ? 'Procesando...' : 'Realizar Pedido'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Editar Item' : 'Nuevo Item'}</DialogTitle>
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
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Categoría"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            margin="normal"
            required
            placeholder="Bebidas, Alimentos, Postres..."
          />
          <TextField
            fullWidth
            label="Precio"
            type="number"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            margin="normal"
            required
            inputProps={{ step: '0.01', min: '0' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveItem}
            disabled={!formData.nombre || !formData.precio || submitting}
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs">
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar <strong>{itemToDelete?.nombre}</strong> del menú?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteItem}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Success Dialog */}
      <Dialog open={orderSuccessOpen} onClose={() => setOrderSuccessOpen(false)} maxWidth="xs">
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            ¡Pedido Realizado!
          </Typography>
          <Typography color="text.secondary" paragraph>
            Tu pedido #{orderNumber} ha sido creado exitosamente
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setOrderSuccessOpen(false);
              navigate('/pedidos');
            }}
          >
            Ver Mis Pedidos
          </Button>
        </DialogContent>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};
