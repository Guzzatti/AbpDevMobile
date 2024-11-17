import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase';
import { Event, LocationType, RootStackParamList } from '../../types';

const MapScreen = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchEvents = () => {
      const user = auth.currentUser;
      const eventsRef = collection(db, 'events');
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      const formattedDate = currentDate.toISOString().split('T')[0];

      const publicEventsQuery = query(
        eventsRef,
        where('isPublic', '==', true),
        where('date', '>=', formattedDate)
      );

      const privateEventsQuery = query(
        eventsRef,
        where('isPublic', '==', false),
        where('date', '>=', formattedDate),
        where('participants', 'array-contains', user?.uid)
      );

      const unsubscribePublicEvents = onSnapshot(publicEventsQuery, (snapshot) => {
        const publicEvents = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Event));
        setEvents((prevEvents) => [...prevEvents, ...publicEvents]);
      });

      const unsubscribePrivateEvents = onSnapshot(privateEventsQuery, (snapshot) => {
        const privateEvents = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Event));
        setEvents((prevEvents) => [...prevEvents, ...privateEvents]);
      });

      return () => {
        unsubscribePublicEvents();
        unsubscribePrivateEvents();
      };
    };

    const delayFetchEvents = setTimeout(fetchEvents, 3000);

    return () => clearTimeout(delayFetchEvents);
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLoading(false);
    };

    fetchLocation();
  }, []);

  const handleAddEvent = () => {
    if (auth.currentUser) {
      navigation.navigate('AddEventModal');
    } else {
      alert('Você precisa estar logado para adicionar um evento');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6f61" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={location as Region}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          toolbarEnabled={false}
          zoomControlEnabled={false}
        >
          {events.map((event) => (
            <Marker
              key={event.id}
              coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              title={event.title}
              description={event.description}
              onCalloutPress={() => navigation.navigate('EventModal', { event })}
            />
          ))}
        </MapView>
      )}
      <TouchableOpacity style={styles.fab} onPress={handleAddEvent}>
        <Ionicons name="add" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#ff6f61',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default MapScreen;