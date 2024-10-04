import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import FeedScreen from '../screens/feedScreen';

const SearchStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Feed"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Feed" component={FeedScreen} />
    </Stack.Navigator>
  );
};
export default SearchStack;
