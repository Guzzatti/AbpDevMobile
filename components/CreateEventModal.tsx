import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, Switch, StyleSheet, Alert } from 'react-native';

type CreateEventModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (eventName: string, isPublic: boolean) => void; // Adicionando callback para salvar
};

const CreateEventModal = ({ isVisible, onClose, onSave }: CreateEventModalProps) => {
  const [eventName, setEventName] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const handleSaveEvent = () => {
    if (!eventName.trim()) {
      Alert.alert('Validation Error', 'Event name is required.');
      return;
    }

    // Chama a função de salvar passando os dados do evento
    onSave(eventName, isPublic);
    onClose(); // Fecha o modal após salvar
    setEventName(''); // Limpa o campo de entrada
    setIsPublic(false); // Reseta o switch
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create New Event</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter event name"
            value={eventName}
            onChangeText={setEventName}
          />

          <View style={styles.switchContainer}>
            <Text>Public Event</Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable style={styles.saveButton} onPress={handleSaveEvent}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
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
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
});

export default CreateEventModal;
