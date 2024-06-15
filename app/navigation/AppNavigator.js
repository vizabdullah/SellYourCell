import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AccountNavigator from "./AccountNavigator";
import FeedNavigator from "./FeedNavigator";

import routes from "./routes";

import ListingEditScreen from "../screens/ListingEditScreen";

import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import NewListingButton from "./NewListingButton";



const AppNavigator = () => {
	const Tab = createBottomTabNavigator();


	const MyHeader = () => {
		return (
			<View style={styles.headerContainer}>
				<StatusBar style="auto" /> 
				<Image
					source={require("../assets/logo.png")}
					resizeMode='contain'
					style={styles.logo}
				/>
				<Text style={styles.headerText}>SellYourCell</Text>
			</View>
		);
	}
	return (
		<Tab.Navigator 
      		screenOptions={{
        		headerShown: true,
        		header: (props) => {
          			return <MyHeader {...props}/>
        		}
      		}}
    	>

			<Tab.Screen name="Feed" component={FeedNavigator}
				options={{
					tabBarIcon: ({ color,size }) => (
						<MaterialCommunityIcons
							name="home"
							color={color}
							size={size}
						/>
					),
					tabBarLabel: ({}) => (
						<Text style={{color: 'black', fontSize: 10}}>Postings</Text>
					),
				}}
				
			/>
			<Tab.Screen
				name="ListingEdit"
				component={ListingEditScreen}
				options={({ navigation }) => ({
					tabBarButton: () => (
						<NewListingButton
							onPress={() =>
								navigation.navigate(routes.LISTING_EDIT)
							}
						/>
					),
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="plus-circle"
							color={color}
							size={size}
						/>
					),
				})}
			/>
			<Tab.Screen
				name="AccountScreen"
				component={AccountNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="account"
							color={color}
							size={size}
						/>
					),
					tabBarLabel: ({}) => (
						<Text style={{color: 'black', fontSize: 10}}>Account</Text>
					),
					headerShown: false
				}}
			/>
		</Tab.Navigator>
	);
};

export default AppNavigator;


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row', // Align children components horizontally
        alignItems: 'center', // Align children components vertically
        justifyContent: 'start', // Align children components horizontally
        paddingTop:5, // Adjust according to your design
        backgroundColor: 'white',
		paddingBottom: 5,
		
    },
    logo: {
        width: 80,
        height: 50,
        marginRight: 10
    },
    headerText: {
        fontSize: 24,
        fontWeight: '200',
		color: 'blue',
		paddingLeft: 35
    },
});

