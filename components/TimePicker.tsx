import React from 'react';
import { View, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';

type TimePickerProps = {
  time: Date | null;
  setTime: (date: Date) => void;
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
};

const TimePicker: React.FC<TimePickerProps> = ({ time, setTime, isVisible, setVisibility }) => {
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setVisibility(false);
    if (selectedTime) setTime(selectedTime);
  };

  const formatTime = (time: Date) => {
    const hour = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');

    return `${hour}:${minutes}`;
  };

  return (
    <View style={styles.timeContainer}>
      {time ? (
        <Text style={styles.buttonText}>{formatTime(time)}</Text>
      ) : (
        <Text style={styles.buttonText}>Selecione a hora</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => setVisibility(true)}>
        <AntDesign name="clockcircleo" size={24} color="black" />
      </TouchableOpacity>
      {isVisible && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
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
