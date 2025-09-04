export const API_CONFIG = {
  BASE_URL: 'http://192.168.15.7:5010/api',
  TIMEOUT: 10000,
  REFRESH_INTERVAL: 2000,
} as const;

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',
  background: '#F2F2F7',
  white: '#FFFFFF',
  text: '#000000',
  textLight: '#666666',
  textSecondary: '#333333',
} as const;

export const METRIC_COLORS = {
  consumption: COLORS.primary,
  power: COLORS.primary,
  current: COLORS.primary,
  voltage: COLORS.primary,
  status: COLORS.primary,
  devices: COLORS.primary,
} as const;

export const MESSAGES = {
  loading: 'Carregando dados...',
  error: 'Não foi possível carregar os dados de energia',
  noData: 'Nenhum dado disponível',
  refresh: 'Puxe para atualizar',
} as const;

export const ANIMATION_CONFIG = {
  duration: 300,
  easing: 'ease-in-out',
} as const;
