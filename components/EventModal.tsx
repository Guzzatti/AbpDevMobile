import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Event } from '../types'; 
import { MaterialIcons } from '@expo/vector-icons'; 

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Imagem em destaque no topo */}
          {event.images && event.images.length > 0 && (
            <Image source={{ uri: event.images[0] }} style={styles.featuredImage} />
          )}

          <View style={styles.contentContainer}>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.date}>📅 {event.date}</Text>
              <Text style={styles.time}>⏰ {event.time}</Text>
              <Text style={styles.description}>{event.description}</Text>

              {/* Galeria de Imagens */}
              {event.images && event.images.length > 1 && (
                <ScrollView horizontal style={styles.gallery}>
                  {event.images.slice(1).map((image, index) => (
                    <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
                  ))}
                </ScrollView>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
              <Text style={styles.actionButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fundo mais escuro para dar foco no modal
  },
  modalContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  featuredImage: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
  time: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 20,
  },
  gallery: {
    flexDirection: 'row',
    marginTop: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  actionButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    alignItems: 'center',
  },
});

export default EventModal;
