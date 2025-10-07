export const STATUS = {
  ACTIVE: 'ACTIVE', // El recurso está activo
  INACTIVE:'INACTIVE', // El recurso está inactivo
  DELETED:'DELETED', // El recurso fue eliminado
  PENDING: 'PENDING', // Pendiente de pago
  PARTIALLY_PAID: 'PARTIALLY_PAID', // Parcialmente pagado
  PAID: 'PAID', // Pagado
  CANCELLED: 'CANCELLED', // Cancelado
  DISPUTED: 'DISPUTED', // En disputa
};


export const ENDPOINTS_WITH_AUTHORIZATION = [
  '/api/auth/login',
  '/api/auth/refreshToken',
];

export const BASE_ENDPOINT = '/api';

export const ROLES = {
  ADMINISTRADOR: 'Administrador',
};

export const BCRYPT_SALT_ROUNDS = 10;
