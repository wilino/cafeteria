/**
 * MFA Setup Page
 * Multi-factor authentication configuration
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import {
  QrCode2,
  Security,
  CheckCircle,
  Warning,
  ContentCopy,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { mfaAPI } from '../services/api.service';
import { pageHeader, cardBase, centerBox } from '../styles/commonStyles';

export const MFASetupPage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationToken, setVerificationToken] = useState('');
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [disableToken, setDisableToken] = useState('');

  const steps = ['Generar Código QR', 'Verificar', 'Códigos de Respaldo'];

  useEffect(() => {
    if (user?.mfa_enabled) {
      setActiveStep(3); // Already enabled
    }
  }, [user]);

  const handleGenerateQR = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await mfaAPI.generate();
      setQrCode(response.data.data.qrCode);
      setSecret(response.data.data.secret);
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al generar código QR');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await mfaAPI.verify(verificationToken);
      setBackupCodes(response.data.data.backupCodes);
      updateUser({ ...user, mfa_enabled: true });
      setActiveStep(2);
      setSuccess('MFA activado correctamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    try {
      setLoading(true);
      setError('');
      await mfaAPI.disable(disableToken);
      updateUser({ ...user, mfa_enabled: false });
      setDisableDialogOpen(false);
      setDisableToken('');
      setActiveStep(0);
      setQrCode('');
      setSecret('');
      setBackupCodes([]);
      setSuccess('MFA desactivado correctamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copiado al portapapeles');
    setTimeout(() => setSuccess(''), 2000);
  };

  if (loading && activeStep === 0) {
    return (
      <Box sx={centerBox}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={pageHeader}>
        <Typography variant="h4">Configuración MFA</Typography>
        <Chip
          icon={user?.mfa_enabled ? <CheckCircle /> : <Warning />}
          label={user?.mfa_enabled ? 'MFA Activado' : 'MFA Desactivado'}
          color={user?.mfa_enabled ? 'success' : 'warning'}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      {!user?.mfa_enabled ? (
        <>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Card sx={cardBase}>
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Protege tu cuenta con MFA
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    La autenticación multifactor añade una capa extra de seguridad
                    a tu cuenta. Necesitarás una aplicación autenticadora como:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                    <Chip label="Google Authenticator" />
                    <Chip label="Microsoft Authenticator" />
                    <Chip label="Authy" />
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<QrCode2 />}
                    onClick={handleGenerateQR}
                    disabled={loading}
                  >
                    Comenzar Configuración
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card sx={cardBase}>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Escanea el código QR
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph align="center">
                  Usa tu aplicación autenticadora para escanear este código QR
                </Typography>
                
                {qrCode && (
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <img src={qrCode} alt="QR Code" style={{ maxWidth: '300px' }} />
                  </Box>
                )}

                {secret && (
                  <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      O ingresa este código manualmente:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                        {secret}
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<ContentCopy />}
                        onClick={() => copyToClipboard(secret)}
                      >
                        Copiar
                      </Button>
                    </Box>
                  </Paper>
                )}

                <TextField
                  fullWidth
                  label="Código de Verificación"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  helperText="Ingresa el código de 6 dígitos de tu app"
                  inputProps={{ maxLength: 6 }}
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleVerify}
                  disabled={verificationToken.length !== 6 || loading}
                >
                  {loading ? 'Verificando...' : 'Verificar y Activar'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card sx={cardBase}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    ¡MFA Activado Correctamente!
                  </Typography>
                </Box>

                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Guarda estos códigos de respaldo en un lugar seguro
                  </Typography>
                  <Typography variant="body2">
                    Podrás usar estos códigos si pierdes acceso a tu aplicación autenticadora.
                    Cada código solo puede usarse una vez.
                  </Typography>
                </Alert>

                <Grid container spacing={2}>
                  {backupCodes.map((code, index) => (
                    <Grid item xs={6} key={index}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: 'grey.100',
                          fontFamily: 'monospace',
                          fontSize: '1.1rem',
                        }}
                      >
                        {code}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ContentCopy />}
                  onClick={() => copyToClipboard(backupCodes.join('\n'))}
                  sx={{ mt: 3 }}
                >
                  Copiar Todos los Códigos
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card sx={cardBase}>
          <CardContent>
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                MFA Activo
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Tu cuenta está protegida con autenticación multifactor
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDisableDialogOpen(true)}
              >
                Desactivar MFA
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Disable MFA Dialog */}
      <Dialog
        open={disableDialogOpen}
        onClose={() => setDisableDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Desactivar MFA</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Desactivar MFA reducirá la seguridad de tu cuenta
          </Alert>
          <TextField
            fullWidth
            label="Código de Verificación"
            value={disableToken}
            onChange={(e) => setDisableToken(e.target.value)}
            helperText="Ingresa un código de tu app o un código de respaldo"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisableDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDisableMFA}
            disabled={!disableToken || loading}
          >
            {loading ? 'Desactivando...' : 'Desactivar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
