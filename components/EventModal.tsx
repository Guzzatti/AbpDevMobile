// src/components/EventModal.tsx

import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { Event } from '../types'; // Importando a interface Event

interface EventModalProps {
    event: Event | null; // O evento pode ser null se não houver seleção
    onClose: () => void; // Função para fechar o modal
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
    if (!event) return null; // Se não houver evento, não renderiza nada

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true} // Você pode controlar a visibilidade do modal aqui
        >
            <View style={styles.container}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.date}>{event.date}</Text>
                <Text style={styles.description}>{event.description}</Text>
                <Text style={styles.time}>{event.time}</Text>
                <Button title="Fechar" onPress={onClose} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 18,
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        marginVertical: 10,
    },
    time: {
        fontSize: 16,
        marginVertical: 10,
    },
});

export default EventModal;
