import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from 'screens/MyProfileScreen';
import EditProfileScreen from 'screens/EditProfileScreen';
import { useState } from 'react';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from 'screens/LoginScreen';
import CreateAccountScreen from 'screens/CreateAccountScreen';
import { TransitionPresets } from '@react-navigation/stack';

function ProfileStack() {
  const Stack = createStackNavigator();
  const [isLogged, setIsLogged] = useState<boolean | null>(null); // null indicates loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLogged(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isLogged === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS }}
      initialRouteName={isLogged ? 'SearchScreen' : 'LoginScreen'}>
      {isLogged ? (
        <>
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginSreen" component={LoginScreen} />
          <Stack.Screen name="CreateAccountScreen" component={CreateAccountScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default ProfileStack;
