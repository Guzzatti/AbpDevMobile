import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Event } from 'types';
import { db } from 'utils/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const FeedScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  const currentDate = new Date(); // Obtém a data atual
  const formattedDate = currentDate.toISOString().split('T')[0]; // Formata a data atual para 'YYYY-MM-DD'

  useEffect(() => {
    const eventsRef = collection(db, 'events');

    // Cria uma query para filtrar eventos públicos e cuja data é maior ou igual à data atual
    const listEventsAvaliable = query(
      eventsRef,
      where('isPublic', '==', true),
      where('date', '>=', formattedDate)
    );

    // Cria um listener para eventos públicos
    const unsubscribePublicEvents = onSnapshot(listEventsAvaliable, (snapshot) => {
      const eventsList: Event[] = [];
      snapshot.forEach((doc) => {
        const eventData = doc.data() as Event;
        eventData.id = doc.id;
        eventsList.push(eventData);
      });

      setEvents(eventsList);
      setLoading(false);
    });

    return () => unsubscribePublicEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6f61" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        initialNumToRender={10} // Limita a renderização inicial
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  list: {
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedScreen;
