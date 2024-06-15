import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity, Modal, Button } from "react-native";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";
import colors from "../config/colors";

function MyListingsScreen({ navigation }) {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      const db = getFirestore();
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const userListing = [];
      querySnapshot.forEach((doc) => {
        userListing.push({ ...doc.data(), id: doc.id });
      });

      setListings(userListing);
    };

    if (user) {
      fetchListings();
    }
  }, [user]);

  const showDeleteModal = (listing) => {
    setSelectedListing(listing);
    setModalVisible(true);
  };

  const deleteListing = async () => {
    if (selectedListing) {
      const db = getFirestore();
      const listingRef = doc(db, "listings", selectedListing.id);
      await deleteDoc(listingRef);

      // Update state to remove the deleted listing
      setListings(listings.filter((listing) => listing.id !== selectedListing.id));
      setModalVisible(false);
      setSelectedListing(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}>
        <View style={styles.card}>
          <Image source={{ uri: item.images[0] }} style={styles.image} />
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>Rs: {item.price}</Text>
            <Text style={styles.price}>{item.category}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => showDeleteModal(item)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Screen style={styles.screen}>
      <FlatList
        data={listings}
        keyExtractor={(listing) => listing.id}
        renderItem={renderItem}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to delete this listing?</Text>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color={colors.medium} />
              <Button title="OK" onPress={deleteListing} color={colors.primary} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 5,
    backgroundColor: colors.light,
    alignItems: 'center'
  },
  cardContainer: {
    marginBottom: 20,
    width: 300,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: "hidden",
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
  price: {
    color: 'grey',
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default MyListingsScreen;
