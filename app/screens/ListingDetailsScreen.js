import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity } from "react-native";
import ImageViewing from "react-native-image-viewing";
import Text from "../components/Text";
import MapView, { Marker } from 'react-native-maps';
import { Screen } from "react-native-screens";
import { Entypo } from '@expo/vector-icons';

function ListingDetailsScreen({ route }) {
    const listing = route.params;
    const [visible, setVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        console.log(listing);
    }, []);

    const images = listing.images.map((url) => ({ uri: url }));

    return (
        <Screen style = {styles.container}>
        <ScrollView>
            <ScrollView horizontal={true}>
                <View style={styles.imageContainer}>
                    {listing.images.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => { setSelectedImageIndex(index); setVisible(true); }}>
                            <Image
                                style={styles.image}
                                source={{ uri: item }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{listing.title}</Text>
                <Text style={styles.price}>Rs: {listing.price}</Text>
                <Text style={{ color: "black", fontWeight: "bold" }}>Description</Text>
                <Text style={styles.price}>{listing.description}</Text>
            </View>

            <Entypo name="location" size={34} color="blue" />
            <View style = {styles.mapContainer}>
                <MapView
                    style = {styles.map}
                    region={{
                        latitude: listing.location.latitude,
                        longitude: listing.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,

                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: listing.location.latitude,
                            longitude: listing.location.longitude,
                        }}
                    />

                </MapView>

            </View>

            <ImageViewing
                images={images}
                imageIndex={selectedImageIndex}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            />
        </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
		padding: 10,
	},
    detailsContainer: {
        marginTop: 10,
    },
    imageContainer: {
        flexDirection: 'row', // Arrange images horizontally
    },
    image: {
        width: 300,
        height: 300,
        marginRight: 10, // Add some spacing between images
    },
    price: {
        color: "grey",
        fontWeight: "bold",
        fontSize: 20,
        marginVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    description: {
        fontSize: 16,
        marginVertical: 10,
    },
    userContainer: {
        marginVertical: 40,
    },
    mapContainer: {
        height: 300,
        marginVertical: 20
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        padding: 20
    },
});

export default ListingDetailsScreen;
