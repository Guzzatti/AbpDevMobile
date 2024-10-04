import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Button, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Switch } from 'react-native-gesture-handler';
import { auth, db } from 'utils/firebase';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';

type RootStackParamList = {};

const AddEventModal = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);

  // Mostra o mapa para selecionar uma localização
  const handleSelectLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão de localização negada');
      return;
    }
    setIsMapVisible(true);
  };

  // Atualiza a localização ao pressionar um ponto no mapa
  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    setIsMapVisible(false); // Fecha o mapa após selecionar o ponto
  };

  // Mostra o DateTimePicker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Esconde o DateTimePicker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Confirma a data e horário selecionado
  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const user = auth.currentUser;

  // Salva o evento
  const handleSaveEvent = () => {
    if (!title || !description || !selectedDate || !location) {
      alert('Preencha todos os campos');
      return;
    }

    const event = {
      title,
      description,
      date: selectedDate.toISOString().split('T')[0], // Apenas data
      time: selectedDate.toISOString().split('T')[1].slice(0, 5), // Apenas horário
      latitude: location.latitude,
      longitude: location.longitude,
      isPublic,
      user: user?.uid,
    };

    addDoc(collection(db, 'events'), event)
      .then(() => {
        console.log('Evento salvo com sucesso');
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Erro ao salvar evento: ', error);
      });

  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      {!isMapVisible ? (
        <>
          <Pressable style={[StyleSheet.absoluteFill]} onPress={() => navigation.goBack()} />
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter event name"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter event description"
              value={description}
              onChangeText={setDescription}
            />

            <Button title="Select Date & Time" onPress={showDatePicker} />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            <Text>
              {selectedDate
                ? `Selected Date & Time: ${selectedDate.toLocaleDateString()} ${selectedDate.toLocaleTimeString()}`
                : 'No date & time selected'}
            </Text>

            <Button title="Select Location on Map" onPress={handleSelectLocation} />

            {location && (
              <Text>
                Selected Location: {location.latitude}, {location.longitude}
              </Text>
            )}

            <View style={styles.switchContainer}>
              <Text>{isPublic ? 'Publico' : 'Privado'}</Text>
              <Switch value={isPublic} onValueChange={setIsPublic} />
            </View>

            <View style={styles.buttonsContainer}>
              <Pressable style={styles.saveButton} onPress={handleSaveEvent}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <MapView
          style={styles.map}
          onPress={handleMapPress} // Permite selecionar o ponto no mapa
          initialRegion={{
            latitude: -28.678, // Localização inicial (pode ser a atual do usuário)
            longitude: -49.362,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          )}
        </MapView>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
