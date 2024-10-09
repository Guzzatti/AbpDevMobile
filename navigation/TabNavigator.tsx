// navigation/tab-navigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SearchStack from './SearchStack';
import SettingsScreen from '../screens/SettingsScreen';
import MapStack from './MapStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={
        ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'map'; // Valor padrão

          switch (route.name) {
            case 'Mapa':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Pesquisar':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Configurações':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'map';
              break;
          }
          // Retorna o ícone do Ionicons baseado no nome da rota
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#ff6f61', // Cor ativa
        tabBarInactiveTintColor: 'gray', // Cor inativa
      })}>
      <Tab.Screen name="Mapa" component={MapStack} />
      <Tab.Screen name="Pesquisar" component={SearchStack} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
