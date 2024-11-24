import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import DatePicker from 'components/DatePicker';
import TimePicker from 'components/TimePicker';
import LocationPicker from 'components/LocationPicker';
import { auth, db } from 'utils/firebase';
import Entypo from '@expo/vector-icons/Entypo';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import LocationText from 'components/LocationText';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { RootStackParamList, LocationType } from 'types';

const AddEventModal = () => {
  const [UserLocation, setUserLocation] = useState<LocationType | null>(null);
  const user = auth.currentUser;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

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
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    setIsMapVisible(false);
  };

  const uploadImages = async (images: string[]): Promise<string[]> => {
    try {
      const urls = await Promise.all(
        images.map(async (image) => {
          const response = await fetch(image);
          const blob = await response.blob();
          const storageRef = ref(
            getStorage(),
            `events/${user?.uid}/${Date.now()}_${Math.random()}.jpg`
          );
          await uploadBytes(storageRef, blob);
          return getDownloadURL(storageRef);
        })
      );
      return urls;
    } catch (error) {
      console.error('Erro ao fazer upload das imagens: ', error);
      return [];
    }
  };

  async function getFollowing() {
    if (!user) {
      console.log("Usuário não autenticado");
      return [];
    }
  
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const following = userDoc.data().following || [];
        console.log('Following: ', following);
        return following;
      } else {
        console.log("Documento do usuário não encontrado.");
        return [];
      }
    } catch (error) {
      console.error("Erro ao buscar seguindo:", error);
      return [];
    }
  }

  // Função para salvar evento
  const handleSaveEvent = async (
    title: string,
    description: string,
    date: string,
    time: string,
    isPublic: boolean,
    latitude: number,
    longitude: number,
    images: string[]
  ) => {
    if (!user) {
      alert('Necessário estar logado para criar um evento');
      return;
    }
    const currentDate = new Date();
    const eventDate = new Date(date);

    if (eventDate < currentDate) {
      alert('Não é possível criar um evento no passado');
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
      user: user.uid,
      participants: await getFollowing(),
    };

    setLoading(true);

    try {
      const imageUrls = await uploadImages(images);
      await addDoc(collection(db, 'events'), { ...event, images: imageUrls });
      alert('Evento salvo com sucesso');
      navigation.goBack();
    } catch (error) {
      alert('Erro ao salvar evento: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const pickerImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      let selectedImages = result.assets?.map((asset) => asset.uri) || [];
      setImages([...images, ...selectedImages]);
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

            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
              isVisible={isDatePickerVisible}
              setVisibility={setDatePickerVisibility}
              text='Data'
            />

            <TimePicker
              time={selectedTime}
              setTime={setSelectedTime}
              isVisible={isTimePickerVisible}
              setVisibility={setTimePickerVisibility}
              text='Horário'
            />

            <View style={styles.buttonLocation}>
              <LocationText location={location} />
              <TouchableOpacity style={styles.button} onPress={() => setIsMapVisible(true)}>
                <Entypo name="location" size={16} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.switchContainer}>
              <Text>{isPublic ? 'Público' : 'Privado'}</Text>
              <Switch value={isPublic} onValueChange={setIsPublic} />
            </View>

            <TouchableOpacity style={styles.button} onPress={pickerImages}>
              <Text style={styles.buttonText}>Adicionar Imagem</Text>
            </TouchableOpacity>

            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', gap: 10 }}>
                {images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={{ width: 100, height: 100, borderRadius: 10 }}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
                disabled={loading}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
                <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  if (!title || !selectedDate || !selectedTime || !location) {
                  alert('Por favor, preencha todos os campos obrigatórios.');
                  return;
                  }
                  handleSaveEvent(
                  title,
                  description,
                  selectedDate.toISOString(),
                  selectedTime.toISOString(),
                  isPublic,
                  location.latitude,
                  location.longitude,
                  images
                  );
                }}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Salvar</Text>
                )}
                </TouchableOpacity>
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