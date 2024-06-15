import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, View, Image, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import axios from "axios";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import colors from "../config/colors";
import routes from "../navigation/routes";
import { FontAwesome } from '@expo/vector-icons';


const GOOGLE_MAPS_API_KEY = 'AIzaSyA3FzKFHiA7bUcmOaubinG6wqCZt8Dw7Yk'; // Replace with your Google Maps API key

function ListingsScreen({ navigation }) {
    const [listings, setListings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchListings = async () => {
        try {
            const db = getFirestore();
            const listingsRef = collection(db, "listings");
            const querySnapshot = await getDocs(listingsRef);

            const listingsData = [];
            for (const doc of querySnapshot.docs) {
                const data = doc.data();
                const areaName = await getAreaName(data.location.latitude, data.location.longitude);
                listingsData.push({ ...data, id: doc.id, areaName });
            }

            setListings(listingsData);
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            setError("Couldn't retrieve the listings.");
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getAreaName = async (latitude, longitude) => {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
            console.log("Requesting URL:", url); // Log the URL for debugging
            const response = await axios.get(url);

            if (response.data.status !== 'OK') {
                throw new Error(`Geocoding API error: ${response.data.status}`);
            }

            const addressComponents = response.data.results[0].address_components;
            const neighborhood = addressComponents.find(component => component.types.includes("neighborhood"));
            const sublocality = addressComponents.find(component => component.types.includes("sublocality_level_1"));
            const locality = addressComponents.find(component => component.types.includes("locality"));

            const areaName = [
                sublocality ? sublocality.long_name : "",
                neighborhood ? neighborhood.long_name : "",
                locality ? locality.long_name : ""
            ].filter(Boolean).join(", ");

            return areaName || "Unknown area";
        } catch (error) {
            console.error("Error fetching area name:", error.message);
            return "Unknown area";
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const filteredListings = listings.filter((listing) =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}>
            <View style={styles.card}>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subTitle}>Rs: {item.price}</Text>
                    <View style={styles.locationContainer}>
                    <FontAwesome name="map-marker" size={18} color="grey" style={styles.locationIcon} />
                    <Text style={styles.area}>{item.areaName}</Text>
                </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchListings();
    };

    return (
        <View style={styles.screen}>
            <TextInput
                style={styles.input}
                placeholder="Search"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />
            {loading && <ActivityIndicator size="large" color={colors.primary} />}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button title="Retry" onPress={fetchListings} />
                </View>
            )}
            <FlatList
                data={filteredListings}
                keyExtractor={(listing) => listing.id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.light,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    card: {
        marginTop: 15,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginBottom: 20,
        overflow: "hidden",
        width: "100%",
    },
    image: {
        width: "100%",
        height: 200,
    },
    detailsContainer: {
        padding: 20,
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
    },
    subTitle: {
        color: 'grey',
        fontWeight: "bold",
        fontSize: 16,
        marginTop: 5,
    },
    area: {
        color: 'grey',
        fontSize: 14,
        marginTop: 5,
    },
    errorContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        fontSize: 16,
    },
	locationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	locationIcon: {
		marginRight: 5,
	},
});

export default ListingsScreen;
