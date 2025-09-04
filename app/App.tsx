import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { DevicesScreen } from './src/screens/DevicesScreen';
import { SummaryScreen } from './src/screens/SummaryScreen';
import { COLORS } from './src/constants';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Statistics" 
          component={StatisticsScreen}
          options={{ title: 'Estatísticas' }}
        />
        <Stack.Screen 
          name="Devices" 
          component={DevicesScreen}
          options={{ title: 'Aparelhos' }}
        />
        <Stack.Screen 
          name="Summary" 
          component={SummaryScreen}
          options={{ title: 'Resumo Geral' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
