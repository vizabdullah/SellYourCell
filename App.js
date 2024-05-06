import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './Apps/Navigation/TabNavigation';







export default function App() 
{
  
  return ( 
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <TabNavigation/>
      </NavigationContainer>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1
    
  },
});
