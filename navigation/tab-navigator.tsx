// navigation/tab-navigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from '../screens/MapScreen';
import SearchStack from './SearchStack.tsx';
import SettingsScreen from '../screens/SettingsScreen';
import AddEventModal from 'screens/AddEventModal';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

const mapStack = createStackNavigator();

const MapStack = () => {
  return (
    <mapStack.Navigator screenOptions={{ headerShown: false }}>
      <mapStack.Screen name="MapScreen" component={MapScreen} />
      <mapStack.Screen
        name="AddEventModal"
        component={AddEventModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          ...TransitionPresets.ModalPresentationIOS,
          cardOverlayEnabled: true,
        }}
      />
    </mapStack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarActiveTintColor: '#00B9D1', // Cor ativa
        tabBarInactiveTintColor: 'gray', // Cor inativa
      })}>
      <Tab.Screen name="Mapa" component={MapStack} />
      <Tab.Screen name="Pesquisar" component={SearchStack} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
