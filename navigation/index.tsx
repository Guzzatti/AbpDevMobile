import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';

import Modal from '../screens/MapScreen';
import TabNavigator from './tab-navigator';

export type RootStackParamList = {
  TabNavigator: undefined;
  Modal: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TabNavigator"
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Modal"
          component={Modal}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            ...TransitionPresets.ModalPresentationIOS,
            cardOverlayEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
