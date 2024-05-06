import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const FootballFixtures = ({navigation,route}) => 
{
   const { id, home_teamname, away_teamname, start_time, leaguename,status } = route.params;  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>{home_teamname} VS {away_teamname}</Text>
        <Text style={styles.text}>Start Time: {new Date(start_time).toLocaleString()}</Text>
        <Text style={styles.text}>League: {leaguename}</Text>
        <Text style={styles.text}>Status: {status}</Text>
       
      </TouchableOpacity>
    </View>
  )
}

export default FootballFixtures

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