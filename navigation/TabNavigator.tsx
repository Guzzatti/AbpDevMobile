import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Keyboard } from 'react-native';
import SearchStack from './SearchStack';
import MapStack from './MapStack';
import FeedStack from './FeedStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'map'; // Valor padrão

          switch (route.name) {
            case 'MapStack':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'FeedStack':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'SearchStack':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'ProfileStack':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'map';
              break;
          }
          // Retorna o ícone do Ionicons baseado no nome da rota
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: () => null, // Remove os nomes das abas
        headerShown: false,
        tabBarActiveTintColor: '#ff6f61', // Cor ativa
        tabBarInactiveTintColor: 'gray', // Cor inativa
        tabBarStyle: { display: isKeyboardVisible ? 'none' : 'flex' }, // Oculta a tab bar quando o teclado está visível
      })}>
      <Tab.Screen name="MapStack" component={MapStack} />
      <Tab.Screen name="FeedStack" component={FeedStack} />
      <Tab.Screen name="SearchStack" component={SearchStack} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
