import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import MapScreen from '../screens/MapScreen';
import AddEventModal from '../screens/AddEventModal';

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
    </Stack.Navigator>
  );
};
export default MapStack;
