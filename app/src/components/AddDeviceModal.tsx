import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants';

interface AddDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  onAddDevice: (deviceData: { nome: string; potencia: number }) => Promise<void>;
  isAdding: boolean;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  visible,
  onClose,
  onAddDevice,
  isAdding,
}) => {
  const [nome, setNome] = useState('');
  const [potencia, setPotencia] = useState('');

  const handleAddDevice = async () => {
    if (!nome.trim() || !potencia.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const potenciaValue = parseFloat(potencia);
    if (isNaN(potenciaValue) || potenciaValue <= 0) {
      Alert.alert('Erro', 'Por favor, insira uma potência válida');
      return;
    }

    try {
      await onAddDevice({
        nome: nome.trim(),
        potencia: potenciaValue,
      });
      
      // Limpar campos após sucesso
      setNome('');
      setPotencia('');
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o aparelho');
    }
  };

  const handleCancel = () => {
    setNome('');
    setPotencia('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCancel}
            disabled={isAdding}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Adicionar Aparelho</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Aparelho</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Ar Condicionado"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Potência (W)</Text>
            <TextInput
              style={styles.input}
              value={potencia}
              onChangeText={setPotencia}
              placeholder="Ex: 1500"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isAdding}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddDevice}
              disabled={isAdding}
            >
              {isAdding ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.addButtonText}>Adicionar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.textLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.textLight,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.textLight,
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
