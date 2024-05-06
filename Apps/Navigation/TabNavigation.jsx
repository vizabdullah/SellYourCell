import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../Screens/HomeScreen';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import CricketScreen from '../Screens/CricketScreen';
import FootballScreen from '../Screens/FootballScreen';
import { Ionicons } from '@expo/vector-icons';
import StackNavigation from './CricketStackNavigation';
import FootballStackNavigation from './FootballStackNavigation';



const TabNavigation = () => 
    {

    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator screenOptions={{headerTitleAlign:'center'}}>
        <Tab.Screen
            name='Sports App'
            component={HomeScreen}
            options={{
                
                tabBarLabel: ({}) => (
                    <Text style={{color: "black", fontSize: 12}}>Home</Text>
                ),
                tabBarIcon: ({color}) => (
                    <AntDesign name="home" size={24} color={color} />   
                )
            }}
        />    
        <Tab.Screen
            name='CricketStackNavigation'
            component={StackNavigation}
            options={{
                tabBarLabel: ({}) => (
                    <Text style = {{color: "black", fontSize: 12}}>Cricket</Text>
                ),
                tabBarIcon: ({color}) => (
                    <MaterialIcons name="sports-cricket" size={24} color={color} />
                ),
                headerShown: false
            }}
        />
        <Tab.Screen
            name='FootballStackNavigation'
            component={FootballStackNavigation}
            options={{
                tabBarLabel: ({}) => (
                    <Text style={{color: "black", fontSize:12}}>Football</Text>
                ),
                tabBarIcon: ({color}) => (
                    <Ionicons name="football-outline" size={24} color={color} />
                ),
                headerShown: false

                
            }}
        />

    </Tab.Navigator>
    )
}

export default TabNavigation