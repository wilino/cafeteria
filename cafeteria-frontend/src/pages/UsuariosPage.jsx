/**
 * Usuarios Page
 * User management (Admin only)
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Lock,
  PersonAdd,
} from '@mui/icons-material';
import { usersAPI } from '../services/api.service';
import { tableHeader, pageHeader } from '../styles/commonStyles';

export const UsuariosPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    role_id: 3, // Default: Cliente
  });
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data.data);
      setError('');
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await usersAPI.getRoles();
      setRoles(response.data.data);
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  const handleOpenForm = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nombre: user.nombre,
        email: user.email,
        password: '',
        role_id: user.role_id,
      });
    } else {
      setEditingUser(null);
      setFormData({ nombre: '', email: '', password: '', role_id: 3 }); // 3 = Cliente
    }
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    try {
      setSubmitting(true);
      setError('');
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await usersAPI.update(editingUser.id, updateData);
        setSuccess('Usuario actualizado correctamente');
      } else {
        await usersAPI.create(formData);
        setSuccess('Usuario creado correctamente');
      }
      await loadUsers();
      handleCloseForm();
    } catch (err) {
      const errorData = err.response?.data;
      let errorMsg = errorData?.message || 'Error al guardar usuario';
      
      // Si hay errores de validación detallados, mostrarlos
      if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        errorMsg = `${errorMsg}:\n${errorData.errors.map(e => `• ${e}`).join('\n')}`;
      }
      
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await usersAPI.delete(userToDelete.id);
      await loadUsers();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setSuccess('Usuario eliminado correctamente');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al eliminar usuario';
      setError(errorMsg);
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleOpenPasswordDialog = (user) => {
    setPasswordUser(user);
    setNewPassword('');
    setPasswordDialogOpen(true);
  };

  const handleChangePassword = async () => {
    try {
      setSubmitting(true);
      setError('');
      await usersAPI.changePassword(passwordUser.id, newPassword);
      setPasswordDialogOpen(false);
      setSuccess('Contraseña actualizada correctamente');
    } catch (err) {
      const errorData = err.response?.data;
      let errorMsg = errorData?.message || 'Error al cambiar contraseña';
      
      // Si hay errores de validación detallados, mostrarlos
      if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        errorMsg = `${errorMsg}:\n${errorData.errors.map(e => `• ${e}`).join('\n')}`;
      }
      
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleColor = (roleName) => {
    if (!roleName) return 'default';
    const roleMap = {
      'Administrador': 'error',
      'Empleado': 'primary',
      'Cliente': 'default',
    };
    return roleMap[roleName] || 'default';
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
        <Typography variant="h4">Gestión de Usuarios</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => handleOpenForm()}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeader}>ID</TableCell>
              <TableCell sx={tableHeader}>Nombre</TableCell>
              <TableCell sx={tableHeader}>Email</TableCell>
              <TableCell sx={tableHeader}>Rol</TableCell>
              <TableCell sx={tableHeader}>MFA</TableCell>
              <TableCell sx={tableHeader} align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role_name || 'Sin rol'}
                    color={getRoleColor(user.role_name)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.mfa_enabled ? (
                    <Chip label="Activado" color="success" size="small" />
                  ) : (
                    <Chip label="Desactivado" size="small" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenForm(user)}
                    title="Editar"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="warning"
                    onClick={() => handleOpenPasswordDialog(user)}
                    title="Cambiar Contraseña"
                  >
                    <Lock />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleOpenDeleteDialog(user)}
                    title="Eliminar"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              {error}
            </Alert>
          )}
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
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label={editingUser ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            required={!editingUser}
            helperText="Mínimo 8 caracteres: mayúsculas, minúsculas, números y símbolos"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.role_id}
              label="Rol"
              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            disabled={
              !formData.nombre ||
              !formData.email ||
              (!editingUser && !formData.password) ||
              submitting
            }
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Usuario: {passwordUser?.nombre} ({passwordUser?.email})
          </Typography>
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            autoFocus
            helperText="Mínimo 8 caracteres: mayúsculas, minúsculas, números y símbolos"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={!newPassword || newPassword.length < 8 || submitting}
          >
            {submitting ? 'Actualizando...' : 'Cambiar'}
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
            ¿Estás seguro de que deseas eliminar al usuario{' '}
            <strong>{userToDelete?.nombre}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteUser}>
            Eliminar
          </Button>
        </DialogActions>
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
