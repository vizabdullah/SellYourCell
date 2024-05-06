import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CricketFixtures = ({ navigation, route }) => 
  {
  const { match_title, venue, date, match_subtitle, home, away } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>{match_title}</Text>
        <Text style={styles.text}>Venue: {venue}</Text>
        <Text style={styles.text}>Date: {new Date(date).toLocaleDateString()}</Text>
        <Text style={styles.text}>Subtitle: {match_subtitle}</Text>
        <Text style={styles.text}>Home Team: {home.name} ({home.code})</Text>
        <Text style={styles.text}>Away Team: {away.name} ({away.code})</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text:
  {
    fontSize: 15,
    
  }
});

export default CricketFixtures;
