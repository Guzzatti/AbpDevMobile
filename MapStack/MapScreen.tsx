import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase';
import { Event, LocationType } from '../../types';
import { RootStackParamList } from '../../types';

const MapScreen = () => {
  // Variáveis de estilo
  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  //Variavel para navegação
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Função para pegar os eventos do Firestore em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const eventsList: Event[] = [];
      snapshot.forEach((doc) => {
        const eventData = doc.data() as Event;
        eventData.id = doc.id; // Adiciona o id do documento ao objeto
        eventsList.push(eventData);
      });
      setEvents(eventsList);
    });

    // Função para remover o listener de eventos
    return () => unsubscribe();
  }, []);

  // Função para pegar a localização do usuário
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLoading(false);
    })();
  }, []);

  // Função para navegar para o modal de adicionar evento
  const navModal = () => {
    if (auth.currentUser) {
      navigation.navigate('AddEventModal');
    } else {
      alert('Você precisa estar logado para adicionar um evento');
    }
  };
  const user = auth.currentUser;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6f61" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={location as Region}
          showsUserLocation={true}
          showsMyLocationButton={true} // Desabilita o botão de localização
          showsCompass={true} // Desabilita a bússola
          toolbarEnabled={false} // Desabilita a toolbar
          zoomControlEnabled={false} // Desabilita o controle de zoom
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
      ) : null}

      {/* Botão de adicionar evento */}
      <TouchableOpacity style={styles.fab} onPress={() => navModal()}>
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
    backgroundColor: '#ff6f61', // Verde menta para o botão flutuante (FAB)
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
    backgroundColor: '#ffffff', // Cor off-white para o fundo do carregamento
  },
});

export default MapScreen;
