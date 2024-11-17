import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LocationType } from 'types';


type LocationPickerProps = {
  UserLocation: LocationType | null;
  location: { latitude: number; longitude: number } | null;
  setIsMapVisible: (visible: boolean) => void;
  handleMapPress: (event: MapPressEvent) => void;
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  UserLocation,
  location,
  setIsMapVisible,
  handleMapPress,
}) => {
  const [searchLocation, setSearchLocation] = useState<string>('');

  async function handleSearchAddress() {

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${searchLocation}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        handleMapPress({
          nativeEvent: {
            coordinate: { latitude: lat, longitude: lng },
          },
        } as MapPressEvent);
      } else {
        alert('Endereço não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      alert('Erro ao buscar endereço');
    }
  }

  return (
    <>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={UserLocation as LocationType}
        showsUserLocation={true}>
        {location && (
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        )}
      </MapView>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquise um local"
          value={searchLocation}
          onChangeText={setSearchLocation}
        />
        <TouchableOpacity style={styles.confirmButton} onPress={()=>handleSearchAddress()}>
          <AntDesign name="search1" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => setIsMapVisible(false)}>
        <Text style={styles.buttonText}>Fechar Mapa</Text>
      </TouchableOpacity>
    </>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff6f61',
    padding: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '85%',
  },
  confirmButton: {
    backgroundColor: '#6fcf97',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
  },
});
