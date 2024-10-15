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
} from 'react-native';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from 'utils/firebase'; // Certifique-se de que o Firebase está configurado corretamente
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from 'types';

const ProfileScreen = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<Number>();
  const [followers, setFollowers] = useState<Number>();

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
          setUserName(userData.username || 'Usuário Sem Nome');
          setProfileImageUrl(userData.profileImageUrl || null);
          setFollowing(userData.following?.length || 0);
          setFollowers(userData.followers?.length || 0);
        } else {
          Alert.alert('Erro', 'Usuário não encontrado no Firestore.');
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
          {profileImageUrl ? (
            <View style={styles.imgContainer}>
              <View style={{ alignItems: 'center' }}>
                <Image source={{ uri: profileImageUrl }} style={styles.userImage} />
                <Text style={styles.title}>{userName}</Text>
              </View>
              <Text style={styles.title}>{followers?.toString()} Seguidores</Text>
              <Text style={styles.title}>{following?.toString()} Seguindo</Text>
            </View>
          ) : (
            <View style={styles.imgContainer}>
              <View style={{ alignItems: 'center' }}>
                <Image source={require('../assets/user.png')} style={styles.userImage} />
                <Text style={styles.title}>{userName}</Text>
              </View>
              <Text style={styles.title}>{followers?.toString()} Seguidores</Text>
              <Text style={styles.title}>{following?.toString()} Seguindo</Text>
            </View>
          )}
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
