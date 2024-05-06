import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FootballScreen from '../Screens/FootballScreen';
import FootballFixtures from '../Screens/FootballFixtures';

const FootballStackNavigation = () => 
{
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
        <Stack.Screen 
          name="Football" 
          component={FootballScreen}
          
        />
        <Stack.Screen 
          name="FootballFixtures" 
          component={FootballFixtures}  
          options={{ title: 'Match Details' }}
          
        />
    
      </Stack.Navigator>
  )
}

export default FootballStackNavigation