import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import CreateEventModal from '../components/CreateEventModal'; // Ajuste o caminho para onde está o modal
import EventModal from '../components/EventModal'; // Importe o novo componente de modal
import { Event } from '../types'; // Importando o tipo Event
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { auth, db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type RootStackParamList = {
  AddEventModal: undefined;
};

const MapScreen = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  async function fetchEvents() {
    const eventsCollection = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsCollection);
    const eventsList: Event[] = [];
    eventsSnapshot.forEach((doc) => {
      const eventData = doc.data() as Event;
      eventData.id = doc.id; // Set the document UID as the event ID
      eventsList.push(eventData);
    });
    setEvents(eventsList);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setEventModalVisible(true);
  };

  const handleCloseEventModal = () => {
    setEventModalVisible(false);
    setSelectedEvent(null);
  };

  const navModal = () => {
    if (auth.currentUser) {
      navigation.navigate('AddEventModal');
    } else {
      alert('Você precisa estar logado para criar um evento');
    }
  };

  const handleSaveEvent = (eventName: string, isPublic: boolean) => {
    const newEvent = {
      id: Math.random().toString(), // Gerar um ID único para o evento
      title: eventName,
      description: isPublic ? 'Evento público' : 'Evento privado',
      date: new Date().toISOString(), // Adicione lógica de data conforme necessário
      time: new Date().toLocaleTimeString(), // Adicione lógica de hora conforme necessário
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
    };
    setEvents([...events, newEvent]); // Adiciona o novo evento ao array de eventos
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView style={styles.map} initialRegion={location as Region} showsUserLocation={true}>
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          {events.map((event) => (
            <Marker
              key={event.id}
              coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              title={event.title}
              onPress={() => handleEventPress(event)} // Abre o modal de evento
            />
          ))}
        </MapView>
      ) : null}

      <TouchableOpacity style={styles.fab} onPress={() => navModal()}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal para criação de evento
                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <CreateEventModal
                    isVisible={modalVisible}
                    onClose={handleCloseModal}
                    onSave={handleSaveEvent} // Passa a função de salvar
                />
            </Modal>
            */}

      {/* Modal para exibir informações do evento */}
      <EventModal event={selectedEvent} onClose={handleCloseEventModal} />
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
    backgroundColor: '#2196F3',
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
  },
});

export default MapScreen;
