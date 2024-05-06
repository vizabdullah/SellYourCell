import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CricketFixtures from '../Screens/CricketFixtures';
import CricketScreen from '../Screens/CricketScreen';



const CricketStackNavigation = () => 
{
    const Stack = createNativeStackNavigator();
  return (

      <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
        <Stack.Screen 
          name="Cricket" 
          component={CricketScreen}
          
        />
        <Stack.Screen 
          name="CricketFixtures" 
          component={CricketFixtures}  
          options={{ title: 'Match Details' }}
          
        />
    
      </Stack.Navigator>
    
  )
}

export default CricketStackNavigation