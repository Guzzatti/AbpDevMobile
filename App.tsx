// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './navigation/TabNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <NavigationContainer>
      {/* Aquela barrinha la em cima que mostra as horas dados da bateria talz */}
      <StatusBar style="auto" />
      <TabNavigator />
    </NavigationContainer>
  );
}
