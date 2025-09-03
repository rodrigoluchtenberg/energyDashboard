import axios from 'axios';
import { Aparelho, ConsumoRealtime, Estatisticas, CreateAparelho } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5010';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiService = {
  async getAparelhos(): Promise<Aparelho[]> {
    const response = await api.get('/api/consumo/aparelhos');
    return response.data;
  },

  async getConsumoAtual(): Promise<ConsumoRealtime[]> {
    const response = await api.get('/api/consumo/atual');
    return response.data;
  },

  async getEstatisticas(): Promise<Estatisticas> {
    const response = await api.get('/api/consumo/estatisticas');
    return response.data;
  },

  async criarAparelho(aparelho: CreateAparelho): Promise<Aparelho> {
    const response = await api.post('/api/aparelhos', aparelho);
    return response.data;
  },

  async deletarAparelho(id: number): Promise<void> {
    await api.delete(`/api/aparelhos/${id}`);
  },

  async invalidateCache(): Promise<void> {
    await api.post('/api/consumo/invalidate-cache');
  }
};

export default apiService;