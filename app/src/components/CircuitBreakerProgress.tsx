import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface CircuitBreakerProgressProps {
  percentage: number;
  status: string;
  current: number;
  maxCurrent: number;
}

export const CircuitBreakerProgress: React.FC<CircuitBreakerProgressProps> = ({
  percentage,
  status,
  current,
  maxCurrent
}) => {
  const getProgressColor = (percentage: number): string => {
    if (percentage <= 30) {
      return COLORS.success; // Verde até 30%
    } else if (percentage <= 70) {
      return COLORS.warning; // Amarelo de 31% a 70%
    } else {
      return COLORS.danger; // Vermelho acima de 70%
    }
  };

  const progressColor = getProgressColor(percentage);
  const clampedPercentage = Math.min(percentage, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Corrente Total (Disjuntor {maxCurrent}A)</Text>
        <Text style={styles.currentValue}>
          {current.toFixed(3)} A
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${clampedPercentage}%`,
                backgroundColor: progressColor
              }
            ]} 
          />
        </View>
        <Text style={styles.percentageText}>
          {percentage.toFixed(1)}% do limite
        </Text>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.statusValue, { color: progressColor }]}>
          {percentage <= 30 ? '🟢 Seguro' : percentage <= 70 ? '🟡 Atenção' : '🔴 Crítico'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  currentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: 4,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
