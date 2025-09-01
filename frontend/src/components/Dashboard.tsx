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

  useEffect(() => {
    loadInitialData();
    const interval = setInterval(loadInitialData, 5000);
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
        
        const top5 = consumosOrdenados.slice(0, 5);
        const correnteTotalCalculada = top5.reduce((sum, consumo) => sum + (consumo.correnteCalculada || 0), 0);
        
        estatisticasData.correnteTotal = parseFloat(correnteTotalCalculada.toFixed(3));
        
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

  const handleDeviceAdded = () => {
    loadInitialData();
  };

  const handleDeleteDevice = async (id: number, nome: string) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja remover o aparelho "${nome}"?`);
    
    if (confirmDelete) {
      try {
        await apiService.deletarAparelho(id);
        loadInitialData();
      } catch (error) {
        alert('Erro ao remover aparelho. Tente novamente.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h1>⚡ Energy Monitor Dashboard</h1>
        <p>Status: {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}</p>
      </header>

      {error && (
        <div style={{ 
          background: '#fee2e2', 
          color: '#dc2626', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {estatisticas && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>Consumo Total Atual</h3>
            <p style={{ fontSize: '2em', color: '#667eea', margin: '10px 0' }}>
              {estatisticas.consumoTotalAtual ? estatisticas.consumoTotalAtual.toFixed(2) : '0.00'} W
            </p>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>Corrente Total (Disjuntor 60A)</h3>
            <p style={{ fontSize: '2em', color: '#10b981', margin: '10px 0' }}>
              {consumos.slice(0, 5).reduce((sum, consumo) => sum + (consumo.correnteCalculada || 0), 0).toFixed(3)} A
            </p>
            <p style={{ fontSize: '1em', color: '#6b7280', margin: '5px 0' }}>
              {estatisticas.percentualDisjuntor ? estatisticas.percentualDisjuntor.toFixed(1) : '0'}% do limite
            </p>
            <div style={{ 
              background: '#f3f4f6', 
              height: '8px', 
              borderRadius: '4px', 
              marginTop: '10px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                background: estatisticas.corStatus === 'danger' ? '#dc2626' : 
                           estatisticas.corStatus === 'warning' ? '#f59e0b' : '#10b981',
                height: '100%', 
                width: `${Math.min(estatisticas.percentualDisjuntor || 0, 100)}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>Status do Disjuntor</h3>
            <p style={{ fontSize: '2em', margin: '10px 0' }}>
              {estatisticas.statusDisjuntor}
            </p>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3>Consumo kWh/h</h3>
            <p style={{ fontSize: '2em', color: '#8b5cf6', margin: '10px 0' }}>
              {estatisticas.consumoKwhTotal ? estatisticas.consumoKwhTotal.toFixed(3) : '0.000'} kWh/h
            </p>
          </div>
        </div>
      )}

      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0 }}>Consumo</h2>
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
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                     <thead>
             <tr style={{ background: '#f3f4f6' }}>
               <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Aparelho</th>
               <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Consumo (W)</th>
               <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>Corrente (A)</th>
               <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e5e7eb' }}>kWh/h</th>
               <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Última Atualização</th>
               <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e5e7eb' }}>Ações</th>
             </tr>
          </thead>
          <tbody>
                         {consumos.length === 0 ? (
               <tr>
                 <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                   {error ? 'Erro ao carregar dados' : 'Carregando...'}
                 </td>
               </tr>
             ) : (
               consumos.map((consumo) => (
                 <tr key={consumo.aparelhoId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                   <td style={{ padding: '12px', fontWeight: 'bold' }}>{consumo.nome}</td>
                                     <td style={{ 
                     padding: '12px', 
                     textAlign: 'right', 
                     fontWeight: 'bold',
                     color: (consumo.corConsumo || 'success') === 'danger' ? '#dc2626' : 
                            (consumo.corConsumo || 'success') === 'warning' ? '#f59e0b' : '#10b981'
                   }}>
                    {consumo.consumoAtual ? consumo.consumoAtual.toFixed(2) : '0.00'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>
                    {consumo.correnteCalculada ? consumo.correnteCalculada.toFixed(3) : '0.000'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>
                    {consumo.consumoKwh ? consumo.consumoKwh.toFixed(3) : '0.000'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#6b7280', fontSize: '0.9em' }}>
                    {formatDateTime(consumo.dataHora)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteDevice(consumo.aparelhoId, consumo.nome)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#dc2626',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      title={`Remover ${consumo.nome}`}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer style={{ 
        marginTop: '30px', 
        textAlign: 'center', 
        color: '#6b7280',
        fontSize: '0.9em'
      }}>
        <p>Energy Monitor </p>
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
      </footer>

      <AddDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeviceAdded={handleDeviceAdded}
      />
    </div>
  );
};

export default Dashboard;