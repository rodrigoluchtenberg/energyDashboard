import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MenuCard } from '../components/MenuCard';
import { useEnergyData } from '../hooks/useEnergyData';
import { COLORS, MESSAGES } from '../constants';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { summary, loading, refreshing, onRefresh } = useEnergyData();

  const menuItems = [
    {
      title: 'Estatísticas',
      subtitle: 'Dados em tempo real e métricas',
      icon: '📊',
      color: COLORS.danger,
      onPress: () => navigation.navigate('Statistics')
    },
    {
      title: 'Aparelhos',
      subtitle: 'Gerenciar dispositivos',
      icon: '🔌',
      color: COLORS.secondary,
      onPress: () => navigation.navigate('Devices')
    },
    {
      title: 'Resumo Geral',
      subtitle: 'Visão geral do sistema',
      icon: '📈',
      color: COLORS.info,
      onPress: () => navigation.navigate('Summary')
    }
  ];

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
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Energy Monitor Dashboard</Text>
        <Text style={styles.headerSubtitle}>Selecione uma opção</Text>
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>
            {summary ? '🟢 Conectado' : '🔴 Desconectado'}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              color={item.color}
              onPress={item.onPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 12,
  },
  connectionStatus: {
    alignSelf: 'flex-start',
  },
  connectionText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  menuContainer: {
    paddingTop: 20,
  },
});
