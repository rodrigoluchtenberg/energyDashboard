import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MetricCard } from '../components/MetricCard';
import { useEnergyData } from '../hooks/useEnergyData';
import { COLORS, METRIC_COLORS, MESSAGES } from '../constants';
import { formatNumber } from '../utils';

export const SummaryScreen: React.FC = () => {
  const { summary, loading, refreshing, onRefresh } = useEnergyData();

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
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {summary && (
          <>
            <MetricCard
              title="Status do Sistema"
              value={summary.statusDisjuntor}
              color={METRIC_COLORS.status}
            />

            <MetricCard
              title="Consumo Médio"
              value={formatNumber(summary.consumoMedioGeral)}
              unit="W"
              color={METRIC_COLORS.consumption}
            />
            
            <MetricCard
              title="Aparelhos Ativos"
              value={`${summary.aparelhosAtivos}/${summary.totalAparelhos}`}
              color={METRIC_COLORS.devices}
            />

            <MetricCard
              title="Top Consumidor"
              value={summary.topConsumidores[0]?.nome || 'N/A'}
              color={METRIC_COLORS.status}
            />

            <MetricCard
              title="Percentual Disjuntor"
              value={`${formatNumber(summary.percentualDisjuntor, 1)}%`}
              color={METRIC_COLORS.current}
            />
          </>
        )}
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
  content: {
    flex: 1,
    paddingTop: 20,
  },
});
