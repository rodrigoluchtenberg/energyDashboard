import { EnergyData } from '../types/api';

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

export const formatUnit = (value: number, unit: string): string => {
  return `${formatNumber(value)} ${unit}`;
};

export const formatPercentage = (value: number): string => {
  return `${formatNumber(value, 1)}%`;
};

export const formatCurrency = (value: number): string => {
  return `R$ ${formatNumber(value)}`;
};

export const calculateTotalConsumption = (data: EnergyData[]): number => {
  return data.reduce((total, item) => total + item.consumoAtual, 0);
};

export const calculateTotalCurrent = (data: EnergyData[]): number => {
  return data.reduce((total, item) => total + item.corrente, 0);
};

export const calculateTotalEnergy = (data: EnergyData[]): number => {
  return data.reduce((total, item) => total + item.consumoKwh, 0);
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'success':
    case '🟢 seguro':
      return '#96CEB4';
    case 'warning':
    case '🟡 atenção':
      return '#FFEAA7';
    case 'danger':
    case '🔴 crítico':
      return '#FF6B6B';
    default:
      return '#666666';
  }
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
