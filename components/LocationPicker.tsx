import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

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
  return (
    <>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={UserLocation as LocationType}
        showsUserLocation={true}
        
        >
        {location && (
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        )}
      </MapView>
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
    bottom: 40,
    right: 20,
    backgroundColor: '#ff6f61',
    padding: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
