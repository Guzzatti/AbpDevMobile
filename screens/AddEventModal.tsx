import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Button,
  Dimensions,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
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

  // Variáveis para coleta dos dados
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);

  // Picker states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

    addDoc(collection(db, 'events'), event)
      .then(() => {
        alert('Evento salvo com sucesso');
        navigation.goBack();
      })
      .catch((error) => {
        alert('Erro ao salvar evento');
      });
  };

  // Função para mostrar o picker de data
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Função para mostrar o picker de hora
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  // Atualiza a data selecionada
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setDatePickerVisibility(false);
    if (selectedDate) setSelectedDate(selectedDate);
  };

  // Atualiza a hora selecionada
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setTimePickerVisibility(false);
    if (selectedTime && selectedDate) {
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setSelectedDate(updatedDate);
    }
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

            <Button title="Selecionar Data" onPress={()=>{showDatePicker()}} />
            {isDatePickerVisible && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}

            <Button title="Selecionar Hora" onPress={()=>{showTimePicker()}} />
            {isTimePickerVisible && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="time"
                display="spinner"
                is24Hour={true}
                onChange={handleTimeChange}
              />
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
              <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <MapView
            style={styles.map}
            onPress={handleMapPress}
            initialRegion={UserLocation as LocationType}>
              {UserLocation && (
                <Marker coordinate={{ latitude: UserLocation.latitude, longitude: UserLocation.longitude }} 
                title='Sua Localização'/>
              )}
            {location && (
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
            )}
          </MapView>
          <TouchableOpacity style={styles.fab} onPress={() => setIsMapVisible(false)}>
            <Text style={styles.buttonText}>Fechar Mapa</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default AddEventModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#00b9d1',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  map: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#00b9d1',
    padding: 15,
    borderRadius: 10,
  },
});
