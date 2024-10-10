import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { StyleSheet } from 'react-native';

type TimePickerProps = {
  time: Date | null;
  setTime: (time: Date) => void;
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
};

const TimePicker: React.FC<TimePickerProps> = ({ time, setTime, isVisible, setVisibility }) => {
  const handleTimeChange = (event: Event, selectedTime?: Date) => {
    if (selectedTime) {
      setTime(selectedTime); // Atualiza o horário sem fechar o DateTimePicker
    }
  };

  const toggleVisibility = () => {
    setVisibility(!isVisible); // Abre ou fecha o DateTimePicker ao clicar no botão do relógio
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.timeContainer}>
      {time ? (
        <Text style={styles.buttonText}>{formatTime(time)}</Text>
      ) : (
        <Text style={styles.buttonText}>Selecione o horário</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={toggleVisibility}>
        <Fontisto name="clock" size={24} color="black" />
      </TouchableOpacity>
      {isVisible && (
        <DateTimePicker
          value={time || new Date()}
          mode="time" // Modo de seleção de horário
          display="default"
          onChange={handleTimeChange} // Altera o horário sem fechar o picker
        />
      )}
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#ff6f61',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});
