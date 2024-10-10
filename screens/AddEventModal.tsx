import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Button,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import DatePicker from 'components/DatePicker';
import TimePicker from 'components/TimePicker';
import LocationPicker from 'components/LocationPicker';
import { auth, db } from 'utils/firebase';
import Entypo from '@expo/vector-icons/Entypo';
import { collection, addDoc } from 'firebase/firestore';
import LocationText from 'components/LocationText';

type RootStackParamList = {};

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const AddEventModal = () => {
  const [UserLocation, setUserLocation] = useState<LocationType | null>(null);
  const user = auth.currentUser;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  // Variáveis para coleta dos dados
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);

  // Picker states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // Função para pegar a localização do usuário
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  // Atualiza a localização ao pressionar um ponto no mapa
  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    setIsMapVisible(false);
  };

  // Função para salvar evento
  const handleSaveEvent = (
    title: string,
    description: string,
    date: string,
    time: string,
    isPublic: boolean,
    latitude: number,
    longitude: number
  ) => {
    if (!user) {
      alert('Necessário estar logado para criar um evento');
      return;
    }
    const event = {
      title,
      description,
      date,
      time,
      latitude,
      longitude,
      isPublic,
      user: user?.uid,
    };
    setLoading(true);
    addDoc(collection(db, 'events'), event)
      .then(() => {
        alert('Evento salvo com sucesso');
        navigation.goBack();
      })
      .catch((error) => {
        alert('Erro ao salvar evento');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      {!isMapVisible ? (
        <>
          <Pressable style={[StyleSheet.absoluteFill]} onPress={() => navigation.goBack()} />
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Criar Novo Evento</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite o nome do evento"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Digite a descrição do evento"
              value={description}
              onChangeText={setDescription}
            />

            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
              isVisible={isDatePickerVisible}
              setVisibility={setDatePickerVisibility}
            />

            <TimePicker
              time={selectedTime}
              setTime={setSelectedTime}
              isVisible={isTimePickerVisible}
              setVisibility={setTimePickerVisibility}
            />

            <View style={styles.buttonLocation}>
              <LocationText location={location} />
              <TouchableOpacity style={styles.button} onPress={() => setIsMapVisible(true)}>
                <Entypo name="location" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.switchContainer}>
              <Text>{isPublic ? 'Público' : 'Privado'}</Text>
              <Switch value={isPublic} onValueChange={setIsPublic} />
            </View>

            <View style={styles.buttonsContainer}>
              <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={styles.saveButton}
                onPress={() => {
                  if (location && selectedDate) {
                    handleSaveEvent(
                      title,
                      description,
                      selectedDate.toISOString().split('T')[0],
                      selectedDate.toISOString().split('T')[1].slice(0, 5),
                      isPublic,
                      location.latitude,
                      location.longitude
                    );
                  } else {
                    alert('Preencha todos os campos');
                  }
                }}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : ''}
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <LocationPicker
          UserLocation={UserLocation}
          location={location}
          setIsMapVisible={setIsMapVisible}
          handleMapPress={handleMapPress}
        />
      )}
    </View>
  );
};

export default AddEventModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    gap: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#4a4a4a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#6fcf97',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  cancelButton: {
    backgroundColor: '#ff6f61',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#ff6f61',
    padding: 15,
    borderRadius: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff6f61',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textLocation: {
    fontWeight: '600',
    fontSize: 16,
  },
});
