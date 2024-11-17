// screens/SearchScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ActivityIndicator, Pressable } from 'react-native';
import { doc, onSnapshot, collection, query, where, getDoc } from 'firebase/firestore';
import { auth, db } from 'utils/firebase'; // Certifique-se de que o Firebase está configurado corretamente
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList, UserType, Event } from 'types';
import { FlatList } from 'react-native-gesture-handler';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserType>();
  const [posts, setPosts] = useState<Event[]>([]);
  const [followers, setFollowers] = useState<UserType[]>([]);
  const [following, setFollowing] = useState<UserType[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();




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

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where('user', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const eventsList: Event[] = [];
        querySnapshot.forEach((doc) => {
          const eventData = doc.data() as Event;
          eventData.id = doc.id;
          eventsList.push(eventData);
        });

        setPosts(eventsList);
      },
      (error) => {
        console.error('Error fetching events:', error);
        Alert.alert('Error', 'Failed to load events. Please check your permissions.');
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
                alert("Seguidores");
              }} style={{padding:10}}>
              <Text style={styles.title}>{userData?.followers.length} Seguidores</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                alert("Seguindo");
              }} style={{padding:10}}>
              <Text style={styles.title}>{userData?.following.length} Seguindo</Text>
            </Pressable>
          </View>
        </>
      )}
      <View style={styles.myPosts}>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postDate}>{item.date}</Text>
              <Text style={styles.postDescription}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
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
    gap: 16,
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
  myPosts: {
    width: '100%',
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 16,
  },
});

export default ProfileScreen;
