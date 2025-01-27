import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";

import Button from "../components/Button";
import routes from "../navigation/routes";

function WelcomeScreen({ navigation }) {
	return (
		<ImageBackground
			blurRadius={12}
			style={styles.background}
			source={require("../assets/background.jpg")}
		>
			<View style={styles.logoContainer}>
				<Image
					style={styles.logo}
					source={require("../assets/logo.png")}
				/>
				<Text style={styles.tagline}>Sell Your Cell Here</Text>
			</View>

			<View style={styles.buttonsContainer}>
				<Button
					title="Login"
					onPress={() => navigation.navigate(routes.LOGIN)}
				/>
				<Button
					title="Register"
					onPress={() => navigation.navigate(routes.REGISTER)}
				/>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		
	},
	buttonsContainer: {
		width: "100%",
		padding: 20,
	},
	logo: {
		width: 200,
		height: 200,
	},
	logoContainer: {
		position: "absolute",
		top: 70,
		alignItems: "center",
	},
	tagline: {
		fontSize: 25,
		fontWeight: "600",
		paddingVertical: 20,
	},
});

export default WelcomeScreen;
