import React, { useState } from 'react';
import { CreateAparelho } from '../types';
import { apiService } from '../services/api';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceAdded: () => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onDeviceAdded }) => {
  const [formData, setFormData] = useState<CreateAparelho>({
    nome: '',
    consumoMedio: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || formData.consumoMedio <= 0) {
      setError('Nome é obrigatório e o consumo deve ser maior que zero');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultado = await apiService.criarAparelho(formData);
      
      setFormData({ nome: '', consumoMedio: 0 });
      
      onDeviceAdded();
      onClose();
    } catch (error: any) {
      setError(`Erro ao adicionar aparelho: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'consumoMedio' ? parseFloat(value) || 0 : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>Adicionar Novo Aparelho</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Nome do Aparelho *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Ex: Geladeira Cozinha"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Consumo Médio (Watts) *
            </label>
            <input
              type="number"
              name="consumoMedio"
              value={formData.consumoMedio || ''}
              onChange={handleInputChange}
              placeholder="Ex: 150"
              min="0.1"
              max="10000"
              step="0.1"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
            <small style={{ color: '#666', fontSize: '14px' }}>
              Entre 0.1W e 10000W
            </small>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#667eea',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                opacity: isLoading ? 0.7 : 1
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar Aparelho'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;
