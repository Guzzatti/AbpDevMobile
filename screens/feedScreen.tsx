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
};

const FeedScreen = () => {
  const navigation = useNavigation<NavigationProp<FeedScreenProps>>();
  const handleLogout = async () => {
    signOut(auth).catch((error) => {
      console.log('Erro ao sair da conta', error);
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('Feed');
      } else {
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, [navigation]);
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
    </View>
  );
};

export default FeedScreen;
