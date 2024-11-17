import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { auth, db } from 'utils/firebase';
import {
  doc,
  getDoc,
  arrayUnion,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { FlatList } from 'react-native';
import { Event } from 'types';
import { RootStackParamList } from 'types';

type SelectedUserProfileRouteProp = RouteProp<RootStackParamList, 'SelectedUserProfile'>;

const SelectedUserProfile = () => {
  const route = useRoute<SelectedUserProfileRouteProp>();
  const { id, username, email, profileImageUrl } = route.params;
  const [events, setEvents] = useState<Event[]>([]);

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserEvents = async () => {
      const userEventsRef = collection(db, 'events');
      const userEventsQuery = query(userEventsRef, where('user', '==', id));

      const userEventsSnapshot = await getDocs(userEventsQuery);
      const userEventsData = userEventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      setEvents(userEventsData);
    };

    fetchUserEvents();
  }, [id]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!auth.currentUser) return;

      const currentUserRef = doc(db, 'users', auth.currentUser.uid);
      const currentUserDoc = await getDoc(currentUserRef);
      const currentUserData = currentUserDoc.data();

      if (currentUserData?.following?.includes(id)) {
        setIsFollowing(true);
      }
    };

    checkIfFollowing();
  }, [id]);

  const handleFollow = async () => {
    if (!auth.currentUser) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    const currentUserRef = doc(db, 'users', auth.currentUser.uid);
    const followedUserRef = doc(db, 'users', id);

    try {
      const currentUserDoc = await getDoc(currentUserRef);
      const currentUserData = currentUserDoc.data();

      if (currentUserData?.following?.includes(id)) {
        await updateDoc(currentUserRef, {
          following: currentUserData.following.filter((userId: string) => userId !== id),
        });

        const followedUserQuery = query(collection(db, 'users'), where('followers', 'array-contains', auth.currentUser.uid));
        const followedUserSnapshot = await getDocs(followedUserQuery);

        followedUserSnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            followers: doc.data().followers.filter((userId: string) => auth.currentUser && userId !== auth.currentUser.uid),
          });
        });

        setIsFollowing(false);
        return;
      }

      await updateDoc(currentUserRef, {
        following: arrayUnion(id),
      });

      await updateDoc(followedUserRef, {
        followers: arrayUnion(auth.currentUser.uid),
      });

      setIsFollowing(true);
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
      Alert.alert('Erro', 'Não foi possível seguir o usuário. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
        <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
          <Text style={styles.buttonText}>{isFollowing ? 'Deixar de seguir' : 'Seguir'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        initialNumToRender={10} // Limita a renderização inicial
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 24,
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#ff6f61',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  list: {
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
  },
});

export default SelectedUserProfile;
