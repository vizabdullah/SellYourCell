import { View, Text, StyleSheet, FlatList, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

const FootballScreen = ({navigation}) =>
{
    const [fixtures, setFixtures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => 
    {
        fetch('https://football536.p.rapidapi.com/fixtures?status=SCHEDULED&date_from=today', {
            method: 'GET',
	headers: {
		'X-RapidAPI-Key': '137ccefd9amshd89d59856b381dcp12850ejsn1ecef5c737ec',
		'X-RapidAPI-Host': 'football536.p.rapidapi.com'
          }
        })
        .then((response) => response.json())
        .then(Data => {
          setFixtures(Data.data);
          console.log("Hy: ",Data)
          
        })
        .catch(err => console.log(err))
        .finally(()=> setIsLoading(false))
    },[]);

    const showFixtureDetails = (cid, chome_teamname, caway_teamname, cstart_time, cleaguename, cstatus) => {
        navigation.navigate('FootballFixtures', {
          id: cid,
          home_teamname: chome_teamname,
          away_teamname: caway_teamname,
          start_time: cstart_time,
          leaguename: cleaguename,
          status: cstatus,
          
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
                      onPress={() => showFixtureDetails(c.id, c.home_team.name, c.away_team.name, c.start_time, c.league.name, c.status )}
                    >
                      <Text style={styles.matchText}>{c.home_team.name} vs {c.away_team.name}</Text>
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

export default FootballScreen

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