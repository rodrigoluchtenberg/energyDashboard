import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';

interface MenuCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  title,
  subtitle,
  icon,
  color,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.card, { borderLeftColor: color }]}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color }]}>{icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
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
    borderLeftWidth: 4,
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.textLight,
  },
});
