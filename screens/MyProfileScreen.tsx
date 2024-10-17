// screens/SearchScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from 'utils/firebase'; // Certifique-se de que o Firebase está configurado corretamente
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList, UserType } from 'types';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserType>();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    signOut(auth).catch((error) => {
      console.log('Erro ao sair da conta', error);
    });
  };

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData as UserType);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  //Arrumar esse loading
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff6f61" />
      ) : (
        <>
          <View style={styles.imgContainer}>
            <View style={{ alignItems: 'center' }}>
              <Image source={{ uri: userData?.profileImageUrl }} style={styles.userImage} />
              <Text style={styles.title}>{userData?.username}</Text>
            </View>
            <Pressable
              onPress={() => {
                console.log('teste');
              }}>
              <Text style={styles.title}>{userData?.followers.length} Seguidores</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                console.log('teste');
              }}>
              <Text style={styles.title}>{userData?.following.length} Seguindo</Text>
            </Pressable>
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleLogout()} style={styles.button}>
          <Text style={styles.buttonText}>Sair da conta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileScreen')}
          style={styles.button}>
          <Text style={styles.buttonText}>Selecionar foto de perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  imgContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  },
  userImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  userName: {
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: '#ff6f61',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    padding: 16,
    gap: 16,
  },
});

export default ProfileScreen;
