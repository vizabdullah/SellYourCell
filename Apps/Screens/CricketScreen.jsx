  import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
  import React, { useEffect, useState } from 'react'
  import { NavigationContainer } from '@react-navigation/native';

  const CricketScreen = ({navigation}) => {
      const [fixtures, setFixtures] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      

      useEffect(() => 
      {
          fetch('https://cricket-live-data.p.rapidapi.com/fixtures', {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': '137ccefd9amshd89d59856b381dcp12850ejsn1ecef5c737ec',
              'X-RapidAPI-Host': 'cricket-live-data.p.rapidapi.com'
            }
          })
          .then((response) => response.json())
          .then(data => {
            setFixtures(data.results);
            console.log("Hello",data)
            
          })
          .catch(err => console.log(err))
          .finally(()=> setIsLoading(false))
      },[]);

      const showFixtureDetails = (fixtureId, title, cvenue, cdate, cmatch_subtitle, chome, caway) => {
        navigation.navigate('CricketFixtures', {
          id: fixtureId,
          match_title: title,
          venue: cvenue,
          date: cdate,
          match_subtitle: cmatch_subtitle,
          home: chome,
          away: caway
        });
      };

      return (
      <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {
          isLoading ?
            (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : (
              <View style={styles.fixturesContainer}>
                {
                  fixtures.map((c, i) =>
                  (
                    <TouchableOpacity
                      key={`key_${i}`}
                      style={styles.matchContainer}
                      onPress={() => showFixtureDetails(c.id, c.match_title, c.venue, c.date, c.match_subtitle, c.home, c.away)}
                    >
                      <Text style={styles.matchText}>{c.match_title}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            )
        }
      </ScrollView>
    </SafeAreaView>
      )
  }

  export default CricketScreen

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingText: {
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: 50,
    },
    fixturesContainer: {
      padding: 16,
    },
    matchContainer: {
      backgroundColor: '#f0f0f0',
      marginBottom: 10,
      padding: 16,
      borderRadius: 8,
    },
    matchText: {
      fontSize: 16,
      color: 'black',
    }
  });

  
