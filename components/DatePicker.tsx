import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fontisto from '@expo/vector-icons/Fontisto';
import { StyleSheet } from 'react-native';

type DatePickerProps = {
  date: Date | null;
  setDate: (date: Date) => void;
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({ date, setDate, isVisible, setVisibility }) => {
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setVisibility(false);
    if (selectedDate) setDate(selectedDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.timeContainer}>
      {date ? (
        <Text style={styles.buttonText}>{formatDate(date)}</Text>
      ) : (
        <Text style={styles.buttonText}>Selecione a data</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => setVisibility(true)}>
        <Fontisto name="date" size={24} color="black" />
      </TouchableOpacity>
      {isVisible && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default DatePicker;

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