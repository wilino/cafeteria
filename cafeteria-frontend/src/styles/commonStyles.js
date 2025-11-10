/**
 * Shared Styles and Theme Utilities
 * Centralized styling constants and reusable style objects
 */

// Common box styles
export const centerBox = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
};

export const fullHeightCenter = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Card styles
export const cardBase = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

export const cardHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 2,
};

// Form styles
export const formContainer = {
  p: 4,
  width: '100%',
  maxWidth: 600,
};

export const formField = {
  mb: 2,
};

// Button groups
export const buttonGroup = {
  display: 'flex',
  gap: 2,
  justifyContent: 'flex-end',
  mt: 3,
};

// Table styles
export const tableContainer = {
  width: '100%',
  overflow: 'auto',
};

export const tableHeader = {
  fontWeight: 600,
  backgroundColor: 'rgba(111, 78, 55, 0.05)',
};

// Status chip colors
export const statusColors = {
  pendiente: 'warning',
  en_preparacion: 'info',
  listo: 'success',
  entregado: 'default',
  cancelado: 'error',
};

// Icon container
export const iconContainer = {
  backgroundColor: 'primary.main',
  borderRadius: '50%',
  p: 2,
  display: 'flex',
  color: 'white',
};

// Stats card
export const statsCard = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

// Page header
export const pageHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 3,
};

// Modal styles
export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

// Dialog actions
export const dialogActions = {
  p: 3,
  gap: 2,
};

// Spacing
export const spacing = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
};
