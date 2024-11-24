import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';

type LocationType = {
  latitude: number;
  longitude: number;
};

const LocationText: React.FC<{ location: LocationType | null }> = ({ location }) => {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchAddress = async () => {
    const apikey = "AIzaSyCJhYQLFrOt17sz_LIlh_WboLA26090cNA"
    if (!location) return;
    setLoading(true);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apikey}`,
    );
    const data = await response.json();
    setAddress(data.results[0].formatted_address.split(',').slice(0, 3).join(', '));
    setLoading(false);
  };

  useEffect(() => {
    fetchAddress();
  }, [location]);

  return (
    <Text style={styles.textLocation}>
      {loading ? <ActivityIndicator size="small" color="#000" /> : ''}
      {location ? address : 'Selecione a localização'}
    </Text>
  );
};

export default LocationText;

const styles = StyleSheet.create({
  textLocation: {
    fontSize: 16,
    width: '80%',
  },
});
