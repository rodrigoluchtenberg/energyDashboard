import React from 'react';
import { ConsumoRealtime } from '../types';

interface ConsumptionTableProps {
  consumos: ConsumoRealtime[];
}

const ConsumptionTable: React.FC<ConsumptionTableProps> = ({ consumos }) => {
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date));
  };



  return (
    <div className="table-container">
      <h3>Consumo</h3>
      <div className="table-wrapper">
        <table className="consumption-table">
          <thead>
            <tr>
              <th>Aparelho</th>
              <th>Tipo</th>
              <th>Consumo Atual (W)</th>
              <th>Tensão (V)</th>
              <th>Corrente (A)</th>
              <th>Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {consumos.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                  Nenhum dado disponível
                </td>
              </tr>
            ) : (
              consumos.map((consumo) => (
                <tr key={consumo.aparelhoId}>
                  <td className="device-name">{consumo.nome}</td>
                  <td className="device-type">{consumo.tipo}</td>
                  <td className={`consumption-value ${consumo.corConsumo || 'success'}`}>
                    {consumo.consumoAtual.toFixed(2)}
                  </td>
                  <td className="voltage">
                    {consumo.tensao ? consumo.tensao.toFixed(1) : '--'}
                  </td>
                  <td className="current">
                    {consumo.corrente ? consumo.corrente.toFixed(3) : '--'}
                  </td>
                  <td className="timestamp">
                    {formatDateTime(consumo.dataHora)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsumptionTable;
