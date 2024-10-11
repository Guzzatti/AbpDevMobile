import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

type TimePickerProps = {
  time: Date | null;
  setTime: (time: Date) => void;
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
};

const TimePicker: React.FC<TimePickerProps> = ({ time, setTime, isVisible, setVisibility }) => {
  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setVisibility(false); // Fecha o DateTimePicker no Android
    }
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
      {Platform.OS === 'ios' ? (
        !isVisible && (
          <TouchableOpacity style={styles.button} onPress={toggleVisibility}>
            <AntDesign name="clockcircleo" size={24} color="white" />
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity style={styles.button} onPress={toggleVisibility}>
          <AntDesign name="clockcircleo" size={24} color="white" />
        </TouchableOpacity>
      )}
      {isVisible && (
        <DateTimePicker
          value={time || new Date()}
          mode="time" // Modo de seleção de horário
          display="default" // Ajuste para Android
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
