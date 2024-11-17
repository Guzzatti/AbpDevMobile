import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import MapScreen from '../screens/MapStack/MapScreen';
import AddEventModal from '../screens/MapStack/AddEventModal';
import EventModal from '../screens/MapStack/EventModal';

const Stack = createStackNavigator();

const MapStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen
        name="AddEventModal"
        component={AddEventModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          ...TransitionPresets.ModalPresentationIOS,
          cardOverlayEnabled: true,
        }}
      />
      <Stack.Screen
        name="EventModal"
        component={EventModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          ...TransitionPresets.ModalPresentationIOS,
          cardOverlayEnabled: true,
        }}
      />
      
    </Stack.Navigator>
  );
};
export default MapStack;
