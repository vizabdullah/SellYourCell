import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import AccountDetails from "../screens/AccountDetails";
import MyListingsScreen from "../screens/MyListingsScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";


const Stack = createStackNavigator();

const AccountNavigator = () => (
	<Stack.Navigator>
		<Stack.Screen name="Account" component={AccountScreen} 
		
		/>
		<Stack.Screen name="AccountDetails" component={AccountDetails} 
		
		/>
		<Stack.Screen name="MyListings" component={MyListingsScreen} />
		<Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />

	</Stack.Navigator>
);

export default AccountNavigator;
