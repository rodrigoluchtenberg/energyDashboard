import React, { useState, useEffect } from 'react';
import { ConsumoRealtime, Estatisticas } from '../types';
import { apiService } from '../services/api';
import AddDeviceModal from './AddDeviceModal';

const Dashboard: React.FC = () => {
  const [consumos, setConsumos] = useState<ConsumoRealtime[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadInitialData();
    const interval = setInterval(loadInitialData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      const [consumosData, estatisticasData] = await Promise.all([
        apiService.getConsumoAtual(),
        apiService.getEstatisticas()
      ]);
      
      if (Array.isArray(consumosData) && estatisticasData) {
        const consumosOrdenados = consumosData.sort((a, b) => (b.consumoAtual || 0) - (a.consumoAtual || 0));
        
        setConsumos(consumosOrdenados);
        setEstatisticas(estatisticasData);
        setIsConnected(true);
        setError(null);
      } else {
        throw new Error('Dados inválidos recebidos da API');
      }
      
    } catch (error) {
      setError('Não consegui conectar com a API. Verifique se o backend está rodando na porta 5010.');
      setIsConnected(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date));
  };

  const handleDeviceAdded = async () => {
    await apiService.invalidateCache();
    
    const [consumosData, estatisticasData] = await Promise.all([
      apiService.getConsumoAtual(),
      apiService.getEstatisticas()
    ]);
    
    if (Array.isArray(consumosData) && estatisticasData) {
      const consumosOrdenados = consumosData.sort((a, b) => (b.consumoAtual || 0) - (a.consumoAtual || 0));
      
      setConsumos(consumosOrdenados);
      setEstatisticas(estatisticasData);
    }
  };

  const handleDeleteDevice = async (id: number, nome: string) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja remover o aparelho "${nome}"?`);
    
    if (confirmDelete) {
      try {
        setIsDeleting(id);
        
        setConsumos(prevConsumos => prevConsumos.filter(consumo => consumo.aparelhoId !== id));
        
        await apiService.deletarAparelho(id);
        
        await apiService.invalidateCache();
        
        const [consumosData, estatisticasData] = await Promise.all([
          apiService.getConsumoAtual(),
          apiService.getEstatisticas()
        ]);
        
        if (Array.isArray(consumosData) && estatisticasData) {
          const consumosOrdenados = consumosData.sort((a, b) => (b.consumoAtual || 0) - (a.consumoAtual || 0));
          
          setConsumos(consumosOrdenados);
          setEstatisticas(estatisticasData);
        }
      } catch (error: any) {
        await loadInitialData();
        
        const errorMessage = error.response?.data?.message ||  
                           error.response?.statusText || 
                           error.message || 
                           'Erro desconhecido';
        
        console.error('Erro ao deletar aparelho:', error);
        alert(`Erro ao remover aparelho: ${errorMessage}`);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="dashboard">
      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Energy Monitor Dashboard</h1>
          <div className="header-controls">
            <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
            </span>
          </div>
        </div>

        {estatisticas && (
          <div className="statistics-section">
            <div className="statistics-grid">
              <div className="stat-card">
                <div className="stat-title">Consumo Total Atual</div>
                <div className="stat-value">
                  {estatisticas.consumoTotalAtual ? estatisticas.consumoTotalAtual.toFixed(2) : '0.00'} W
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-title">Corrente Total (Disjuntor 60A)</div>
                <div className="stat-value">
                  {estatisticas.correnteTotal ? estatisticas.correnteTotal.toFixed(3) : '0.000'} A
                </div>
                <div className="stat-subtitle">
                  {estatisticas.percentualDisjuntor ? estatisticas.percentualDisjuntor.toFixed(1) : '0'}% do limite
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${estatisticas.corStatus || 'success'}`}
                    style={{ width: `${Math.min(estatisticas.percentualDisjuntor || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-title">Status do Disjuntor</div>
                <div className="stat-value">{estatisticas.statusDisjuntor}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-title">Consumo kWh/h</div>
                <div className="stat-value">
                  {estatisticas.consumoKwhTotal ? estatisticas.consumoKwhTotal.toFixed(3) : '0.000'} kWh/h
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="table-section">
          <div className="table-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Consumo</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                + Adicionar Aparelho
              </button>
            </div>
            <div className="table-wrapper">
              <table className="consumption-table">
                <thead>
                  <tr>
                    <th>Aparelho</th>
                    <th>Consumo (W)</th>
                    <th>Corrente (A)</th>
                    <th>kWh/h</th>
                    <th>Última Atualização</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {consumos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="no-data">
                        {error ? 'Erro ao carregar dados' : 'Carregando...'}
                      </td>
                    </tr>
                  ) : (
                    consumos.map((consumo) => (
                      <tr key={consumo.aparelhoId}>
                        <td className="device-name">{consumo.nome}</td>
                        <td className={`consumption-value ${consumo.corConsumo || 'low-consumption'}`}>
                          {consumo.consumoAtual ? consumo.consumoAtual.toFixed(2) : '0.00'}
                        </td>
                        <td className="current">{consumo.correnteCalculada ? consumo.correnteCalculada.toFixed(3) : '0.000'}</td>
                        <td className="voltage">{consumo.consumoKwh ? consumo.consumoKwh.toFixed(3) : '0.000'}</td>
                        <td className="timestamp">{formatDateTime(consumo.dataHora)}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteDevice(consumo.aparelhoId, consumo.nome)}
                            disabled={isDeleting === consumo.aparelhoId}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: isDeleting === consumo.aparelhoId ? 'not-allowed' : 'pointer',
                              fontSize: '18px',
                              color: isDeleting === consumo.aparelhoId ? '#9ca3af' : '#dc2626',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              transition: 'background-color 0.2s',
                              opacity: isDeleting === consumo.aparelhoId ? 0.6 : 1
                            }}
                            onMouseOver={(e) => {
                              if (isDeleting !== consumo.aparelhoId) {
                                e.currentTarget.style.backgroundColor = '#fee2e2';
                              }
                            }}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title={isDeleting === consumo.aparelhoId ? 'Removendo...' : `Remover ${consumo.nome}`}
                          >
                            {isDeleting === consumo.aparelhoId ? '⏳' : '🗑️'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="dashboard-footer">
          <p>Energy Monitor</p>
          <p style={{ marginTop: '10px', fontSize: '0.8em', color: '#9ca3af' }}>
            Created by <strong>Rodrigo Joel Luchtenberg</strong> - 
            <a 
              href="https://www.linkedin.com/in/rodrigo-luchtenberg/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#3b82f6', 
                textDecoration: 'none',
                marginLeft: '5px',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>

      <AddDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeviceAdded={handleDeviceAdded}
      />
    </div>
  );
};

export default Dashboard;