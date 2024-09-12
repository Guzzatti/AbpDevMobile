// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './navigation/tab-navigator';

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
