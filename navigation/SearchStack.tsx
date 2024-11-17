import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from 'screens/SearchStack/SearchScreen';
import SelectedUserProfile from 'screens/SearchStack/SelectedUserProfile';
import { TransitionPresets } from '@react-navigation/stack';
import { useState } from 'react';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from 'screens/LoginScreen';
import CreateAccountScreen from 'screens/CreateAccountScreen';

const SearchStack = () => {
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
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="SelectedUserProfile" component={SelectedUserProfile} />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="CreateAccountScreen" component={CreateAccountScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default SearchStack;
