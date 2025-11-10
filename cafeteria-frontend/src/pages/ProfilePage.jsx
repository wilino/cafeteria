/**
 * Profile Page
 * User profile management and settings
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Lock,
  Security,
  Save,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api.service';
import { pageHeader, cardBase } from '../styles/commonStyles';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre,
        email: user.email,
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await usersAPI.update(user.id, profileData);
      updateUser({ ...user, ...profileData });
      
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }

      setLoading(true);
      setError('');

      await usersAPI.changePassword(user.id, passwordData.newPassword);
      
      setPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccess('Contraseña cambiada correctamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (rol) => {
    const colors = {
      admin: 'error',
      empleado: 'primary',
      cliente: 'default',
    };
    return colors[rol] || 'default';
  };

  return (
    <Box>
      <Box sx={pageHeader}>
        <Typography variant="h4">Mi Perfil</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={4}>
          <Card sx={cardBase}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                }}
              >
                {user?.nombre?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user?.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Chip
                label={user?.rol}
                color={getRoleColor(user?.rol)}
                sx={{ mt: 1 }}
              />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                <Security fontSize="small" color={user?.mfa_enabled ? 'success' : 'disabled'} />
                <Typography variant="body2">
                  MFA: {user?.mfa_enabled ? 'Activado' : 'Desactivado'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/mfa-setup')}
              >
                Configurar MFA
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Profile Card */}
        <Grid item xs={12} md={8}>
          <Card sx={cardBase}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Información Personal
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Nombre"
                value={profileData.nombre}
                onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                margin="normal"
              />

              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                onClick={handleUpdateProfile}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                Guardar Cambios
              </Button>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Lock sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Seguridad
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setPasswordDialogOpen(true)}
              >
                Cambiar Contraseña
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            margin="normal"
            autoFocus
            helperText="Mínimo 8 caracteres"
          />
          <TextField
            fullWidth
            label="Confirmar Contraseña"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={
              !passwordData.newPassword ||
              !passwordData.confirmPassword ||
              loading
            }
          >
            {loading ? 'Cambiando...' : 'Cambiar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
