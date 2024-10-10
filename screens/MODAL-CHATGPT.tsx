// aqui o datetimepicker esta beeeeeem melhor, mas tem que adaptar com o arquivo original AddEventModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Button,
  Switch,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from 'utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

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

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);

  // Picker states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

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

    addDoc(collection(db, 'events'), event)
      .then(() => {
        alert('Evento salvo com sucesso');
        navigation.goBack();
      })
      .catch((error) => {
        alert('Erro ao salvar evento');
      });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime && selectedDate) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setSelectedDate(updatedDate);
    }
  };

  const confirmDateSelection = () => {
    setDatePickerVisibility(false);
  };

  const confirmTimeSelection = () => {
    setTimePickerVisibility(false);
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

            <Button title="Selecionar Data" onPress={() => setDatePickerVisibility(true)} />
            {isDatePickerVisible && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            {isDatePickerVisible && (
              <Button title="Confirmar Data" onPress={confirmDateSelection} />
            )}

            <Button title="Selecionar Hora" onPress={() => setTimePickerVisibility(true)} />
            {isTimePickerVisible && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="time"
                display="default"
                is24Hour={true}
                onChange={handleTimeChange}
              />
            )}
            {isTimePickerVisible && (
              <Button title="Confirmar Hora" onPress={confirmTimeSelection} />
            )}

            <Text>
              {selectedDate
                ? `Data e Hora Selecionada: ${selectedDate.toLocaleDateString('pt-br')} ${selectedDate.toLocaleTimeString('pt-br')}`
                : 'Nenhuma data e hora selecionada'}
            </Text>

            <Button title="Selecionar Localização no Mapa" onPress={() => setIsMapVisible(true)} />
            {location && (
              <Text>
                Localização Selecionada: {location.latitude}, {location.longitude}
              </Text>
            )}

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
                <Text style={styles.buttonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <MapView
            style={styles.map}
            onPress={(event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              setLocation({ latitude, longitude });
              setIsMapVisible(false);
            }}
            initialRegion={UserLocation as LocationType}>
            {UserLocation && (
              <Marker
                coordinate={{ latitude: UserLocation.latitude, longitude: UserLocation.longitude }}
                title="Sua Localização"
              />
            )}
            {location && (
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
            )}
          </MapView>
          <Pressable style={styles.fab} onPress={() => setIsMapVisible(false)}>
            <Text style={styles.buttonText}>Fechar Mapa</Text>
          </Pressable>
        </>
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
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ee',
    borderRadius: 50,
    padding: 15,
    elevation: 8,
  },
});
