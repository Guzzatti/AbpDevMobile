import { View, Text, Button } from 'react-native';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';

type FeedScreenProps = {
  Feed: undefined;
  Login: undefined;
  Configurações: undefined;
  SearchScreen: undefined;
};

const FeedScreen = () => {
  const navigation = useNavigation<NavigationProp<FeedScreenProps>>();
  const handleLogout = async () => {
    signOut(auth).catch((error) => {
      console.log('Erro ao sair da conta', error);
    });
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <Text>Feed Screen</Text>
      <TouchableOpacity
        onPress={() => handleLogout()}
        style={{
          width: 100,
          backgroundColor: 'white',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Sair da conta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('SearchScreen')}
        style={{
          width: 100,
          backgroundColor: 'white',
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        }}>
        <Text>Visualizar foto de perfil</Text>
      </TouchableOpacity>

    </View>
  );
};

export default FeedScreen;
