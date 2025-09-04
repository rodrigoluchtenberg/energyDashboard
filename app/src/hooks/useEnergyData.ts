import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { energyService } from '../services/api';
import { EnergyData, EnergySummary } from '../types/api';
import { API_CONFIG } from '../constants';

export const useEnergyData = () => {
  const [realTimeData, setRealTimeData] = useState<EnergyData[]>([]);
  const [summary, setSummary] = useState<EnergySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async () => {
    try {
      const [realTime, summaryData] = await Promise.all([
        energyService.getRealTimeData(),
        energyService.getEnergySummary()
      ]);
      
      setRealTimeData(realTime);
      setSummary(summaryData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados de energia');
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const deleteDevice = async (id: number, name: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja remover o aparelho "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(id);
              await energyService.deleteDevice(id);
              await fetchData();
              Alert.alert('Sucesso', 'Aparelho removido com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o aparelho');
              console.error('Erro ao deletar aparelho:', error);
            } finally {
              setIsDeleting(null);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, API_CONFIG.REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const addDevice = async (deviceData: { nome: string; potencia: number }) => {
    try {
      setIsAdding(true);
      
      // Calcular a corrente do novo aparelho (P = V × I, onde V = 220V)
      const correnteNovoAparelho = deviceData.potencia / 220;
      
      // Obter a corrente total atual
      const correnteTotalAtual = summary?.correnteTotal || 0;
      
      // Calcular a nova corrente total
      const novaCorrenteTotal = correnteTotalAtual + correnteNovoAparelho;
      
      // Verificar se excederá o limite de 60A
      if (novaCorrenteTotal > 60) {
        Alert.alert(
          'Limite Excedido',
          `Não é possível adicionar este aparelho. A corrente total seria ${novaCorrenteTotal.toFixed(2)}A, excedendo o limite de 60A do disjuntor.`,
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }
      
      await energyService.addDevice(deviceData);
      await fetchData();
      Alert.alert('Sucesso', 'Aparelho adicionado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o aparelho');
      console.error('Erro ao adicionar aparelho:', error);
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    realTimeData,
    summary,
    loading,
    refreshing,
    isDeleting,
    isAdding,
    onRefresh,
    deleteDevice,
    addDevice,
    refetch: fetchData
  };
};
