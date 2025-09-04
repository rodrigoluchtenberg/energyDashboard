import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DeviceList } from '../components/DeviceList';
import { AddDeviceModal } from '../components/AddDeviceModal';
import { useEnergyData } from '../hooks/useEnergyData';
import { COLORS, MESSAGES } from '../constants';

interface DevicesScreenProps {
  navigation: any;
}

export const DevicesScreen: React.FC<DevicesScreenProps> = ({ navigation }) => {
  const { 
    realTimeData, 
    loading, 
    refreshing, 
    isDeleting,
    isAdding,
    onRefresh, 
    deleteDevice,
    addDevice
  } = useEnergyData();

  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.headerButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{MESSAGES.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <DeviceList
        devices={realTimeData}
        onDeleteDevice={deleteDevice}
        isDeleting={isDeleting}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <AddDeviceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddDevice={addDevice}
        isAdding={isAdding}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerButton: {
    marginRight: 16,
  },
  headerButtonText: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  content: {
    flex: 1,
  },
});
