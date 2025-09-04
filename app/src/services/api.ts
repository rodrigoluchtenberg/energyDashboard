import axios from 'axios';
import { EnergyData, EnergySummary } from '../types/api';
import { API_CONFIG } from '../constants';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const energyService = {
  getRealTimeData: async (): Promise<EnergyData[]> => {
    try {
      const response = await api.get<EnergyData[]>('/consumo/atual');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados em tempo real:', error);
      throw error;
    }
  },

  getHistoricalData: async (startDate: string, endDate: string): Promise<EnergyData[]> => {
    try {
      const response = await api.get<EnergyData[]>('/consumo/estatisticas', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados históricos:', error);
      throw error;
    }
  },

  getEnergySummary: async (period: string = 'today'): Promise<EnergySummary> => {
    try {
      const response = await api.get<EnergySummary>('/consumo/estatisticas', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar resumo de energia:', error);
      throw error;
    }
  },

  getChartData: async (metric: string, period: string = '24h'): Promise<any> => {
    try {
      const response = await api.get<any>('/consumo/estatisticas', {
        params: { metric, period }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      throw error;
    }
  },

  deleteDevice: async (id: number): Promise<void> => {
    try {
      await api.delete(`/aparelhos/${id}`);
    } catch (error) {
      console.error('Erro ao deletar aparelho:', error);
      throw error;
    }
  },

  addDevice: async (deviceData: { nome: string; potencia: number }): Promise<void> => {
    try {
      await api.post('/aparelhos', {
        nome: deviceData.nome,
        consumoMedio: deviceData.potencia
      });
    } catch (error) {
      console.error('Erro ao adicionar aparelho:', error);
      throw error;
    }
  },
};

export default api;
