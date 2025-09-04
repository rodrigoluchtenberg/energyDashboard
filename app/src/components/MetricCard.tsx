import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MetricCardProps } from '../types/api';
import { COLORS } from '../constants';

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  color = COLORS.primary 
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
    borderLeftWidth: 4,
  },
  title: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 4,
  },
  unit: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});
