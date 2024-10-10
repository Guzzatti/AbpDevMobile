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
    if (location) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
        );

        const data = await response.json();

        if (data && data.address) {
          const { postcode, road } = data.address; // Extrai o CEP e o nome da rua

          // Monta a string do endereço
          const tempAddress = `${road ? road : 'Rua não encontrada'}, ${postcode ? postcode : 'CEP não encontrado'}`;
          setAddress(tempAddress);
        } else {
          setAddress('Endereço não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        setAddress('Erro ao buscar endereço');
      } finally {
        setLoading(false);
      }
    }
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
  },
});
