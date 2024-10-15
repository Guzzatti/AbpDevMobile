import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import FeedScreen from '../screens/FeedScreen';

function FeedStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name="FeedScreen" component={FeedScreen} />
    </Stack.Navigator>
  );
}

export default FeedStack;
