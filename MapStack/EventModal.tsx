import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { RootStackParamList } from 'types';
import { NavigationProp } from '@react-navigation/native';

type selectedEvent = RouteProp<RootStackParamList, 'EventModal'>;
function EventModal() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<selectedEvent>();
  const { event } = route.params;

  function formatDate(date: string) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR').slice(0, 10);
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={[StyleSheet.absoluteFill]}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.modalContainer}>
        {event.images && event.images.length > 0 && (
          <Image source={{ uri: event.images[0] }} style={styles.featuredImage} />
        )}

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>📅 {formatDate(event.date)}</Text>
          <Text style={styles.time}>⏰ {event.time}</Text>
          <Text style={styles.description}>{event.description}</Text>

          {event.images && event.images.length > 1 && (
            <ScrollView horizontal contentContainerStyle={styles.gallery}>
              {event.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
              ))}
            </ScrollView>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={styles.actionButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    gap: 10,
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#777',
  },
  time: {
    fontSize: 16,
    color: '#777',
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  gallery: {
    alignItems: 'center',
    gap: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  actionButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
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
