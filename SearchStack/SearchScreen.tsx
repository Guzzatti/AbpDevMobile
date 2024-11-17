import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { auth, db } from 'utils/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  onSnapshot,
  deleteDoc,
  arrayRemove,
} from 'firebase/firestore';
import { ActivityIndicator } from 'react-native';
import { Image } from 'react-native';
import { UserType, RootStackParamList } from 'types';
import { NavigationProp, useNavigation } from '@react-navigation/native'; // Importe o hook de navegação
import Feather from '@expo/vector-icons/Feather';

const SearchScreen = () => {
  const [userName, setUserName] = useState<string>('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [history, setHistory] = useState<UserType[]>([]);

  useEffect(() => {
    // Limita a pesquisa para entradas com pelo menos 2 caracteres
    if (userName.length < 2) {
      setUsers([]); // Limpa a lista se o campo de busca estiver vazio ou com menos de 2 caracteres
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef,
          where('username', '>=', userName),
          where('username', '<=', userName + '\uf8ff')
        );

        const emailQuery = query(
          usersRef,
          where('email', '>=', userName),
          where('email', '<=', userName + '\uf8ff')
        );

        const [usernameSnapshot, emailSnapshot] = await Promise.all([
          getDocs(q),
          getDocs(emailQuery),
        ]);

        const querySnapshot = {
          docs: [...usernameSnapshot.docs, ...emailSnapshot.docs],
        };

        const fetchedUsers: UserType[] = [];
        querySnapshot.docs.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() } as UserType);
        });

        setUsers(fetchedUsers);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao buscar usuários');
        console.error('Erro ao buscar usuários: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userName]);

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
      async (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();

          const usersRef = collection(db, 'users');
          const querySnapshot = await getDocs(usersRef);

          const fetchedUsers: UserType[] = [];

          querySnapshot.forEach((doc) => {
            if (userData.recentSearches.includes(doc.id)) {
              fetchedUsers.push({ id: doc.id, ...doc.data() } as UserType);
            }
          });

          setHistory(fetchedUsers);
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

  const handleDeleteSearch = async (user: UserType) => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      updateDoc(userRef, {
        recentSearches: arrayRemove(user.id),
      });
    } else {
      Alert.alert('Erro', 'Usuário não autenticado');
    }
  };

  const handleUserPress = (user: UserType) => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      updateDoc(userRef, {
        recentSearches: arrayUnion(user.id),
      });
    } else {
      Alert.alert('Erro', 'Usuário não autenticado');
    }
    navigation.navigate('SelectedUserProfile', {
      id: user.id,
      username: user.username,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do usuário ou email"
          value={userName}
          onChangeText={setUserName}
        />
        {userName.length >= 2 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => setUserName('')}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {userName.length < 2 && (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserPress(item)} style={styles.deleteUserItem}>
              <View style={styles.deleteUserItemData}>
                <Image source={{ uri: item.profileImageUrl }} style={styles.userImage} />
                <View>
                  <Text style={styles.userName}>{item.username}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                </View>
              </View>
              <TouchableOpacity style={{ padding: 10 }} onPress={() => handleDeleteSearch(item)}>
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          style={styles.userList}
        />
      )}
      {loading && <ActivityIndicator size="large" color="#ff6f61" style={{ zIndex: 2 }} />}
      {!loading && users.length === 0 && userName.length >= 2 && (
        <Text style={styles.noResultsText}>Nenhum usuário encontrado</Text>
      )}
      {userName.length >= 2 && (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserPress(item)} style={styles.userItem}>
              <Image source={{ uri: item.profileImageUrl }} style={styles.userImage} />
              <View>
                <Text style={styles.userName}>{item.username}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
          style={styles.userList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 16,
  },
  userList: {
    width: '100%',
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deleteUserItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
  },
  deleteUserItemData: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  userName: {
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#888',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginTop: 8,
  },
  noResultsText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
});

export default SearchScreen;
