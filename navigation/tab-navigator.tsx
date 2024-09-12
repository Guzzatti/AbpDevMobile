// navigation/tab-navigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MapScreen from '../screens/MapScreen';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Criação de telas fictícias para outros menus
const EventScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Criar Evento</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Perfil</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Mapa') {
              iconName = 'md-map';
            } else if (route.name === 'Criar Evento') {
              iconName = 'md-add-circle';
            } else if (route.name === 'Perfil') {
              iconName = 'md-person';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#00B9D1', // Cores do seu app
          tabBarInactiveTintColor: '#B4B2B0',
          tabBarStyle: {
            backgroundColor: '#043E59', // Cor de fundo do menu
            borderTopWidth: 0, // Remover borda superior
            height: 60,
            paddingBottom: 5,
          },
        })}
      >
        <Tab.Screen name="Mapa" component={MapScreen} />
        <Tab.Screen name="Criar Evento" component={EventScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigator;
