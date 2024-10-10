// screens/SearchScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from 'utils/firebase'; // Certifique-se de que o Firebase está configurado corretamente

const SearchScreen = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          Alert.alert('Erro', 'Usuário não autenticado.');
          setLoading(false);
          return;
        }

        // Busca os dados do usuário autenticado no Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.username || 'Usuário Sem Nome');
          setProfileImageUrl(userData.profileImageUrl || null);
        } else {
          Alert.alert('Erro', 'Usuário não encontrado no Firestore.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} style={styles.userImage} />
          ) : (
            <Text>Sem foto</Text>
          )}
          <Text style={styles.userName}>{userName}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 16,
  },
});

export default SearchScreen;
