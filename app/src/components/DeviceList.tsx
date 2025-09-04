import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { EnergyData } from '../types/api';
import { COLORS } from '../constants';
import { formatNumber, formatDateTime } from '../utils';

interface DeviceListProps {
  devices: EnergyData[];
  onDeleteDevice?: (id: number, name: string) => void;
  isDeleting?: number | null;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const DeviceList: React.FC<DeviceListProps> = ({ 
  devices, 
  onDeleteDevice, 
  isDeleting,
  refreshing,
  onRefresh
}) => {
  const renderDeviceItem = ({ item }: { item: EnergyData }) => (
         <View style={styles.deviceRow}>
       <View style={styles.deviceInfo}>
         <Text style={styles.deviceName}>{item.nome}</Text>
       </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Consumo</Text>
          <Text style={[styles.metricValue, { color: getConsumptionColor(item.corConsumo) }]}>
            {formatNumber(item.consumoAtual)} W
          </Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Corrente</Text>
          <Text style={styles.metricValue}>
            {formatNumber(item.correnteCalculada, 3)} A
          </Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>kWh/h</Text>
          <Text style={styles.metricValue}>
            {formatNumber(item.consumoKwh, 3)}
          </Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Última Atualização</Text>
          <Text style={styles.timestamp}>
            {formatDateTime(item.dataHora)}
          </Text>
        </View>
      </View>
      
      {onDeleteDevice && (
        <TouchableOpacity
          style={[styles.deleteButton, isDeleting === item.aparelhoId && styles.deleting]}
          onPress={() => onDeleteDevice(item.aparelhoId, item.nome)}
          disabled={isDeleting === item.aparelhoId}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting === item.aparelhoId ? '⏳' : '🗑️'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const getConsumptionColor = (corConsumo: string): string => {
    switch (corConsumo) {
      case 'high-consumption':
        return COLORS.danger;
      case 'medium-consumption':
        return COLORS.warning;
      case 'low-consumption':
        return COLORS.success;
      default:
        return COLORS.text;
    }
  };

  if (devices.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum aparelho encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.aparelhoId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} />
          ) : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  deviceRow: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  metricsContainer: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
    minWidth: 60,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.danger,
    marginLeft: 8,
  },
  deleting: {
    backgroundColor: COLORS.textLight,
  },
  deleteButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});
