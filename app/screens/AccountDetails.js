import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Button, Alert } from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import useAuth from "../auth/useAuth";
import Screen from "../components/Screen";

function AccountDetails() {
  const { user } = useAuth();
  const [userName, setUserName] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUserName(userData.name);
      }
    };

    fetchUserName();
  }, [user]);

  const handleUpdate = async () => {
    if (newName.trim() === "") {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { name: newName });
      setUserName(newName);
      Alert.alert("Success", "Name updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update name");
    }
  };

  return (
    <Screen style={styles.container}>
 
      <TextInput
        style={styles.input}
        value={user.email}
        readOnly
      />
       <TextInput
        style={styles.input}
        value={userName}
        readOnly
      />
      <TextInput
        style={styles.input}
        placeholder="New Name"
        value={newName}
        onChangeText={setNewName}
      />
      <View style={styles.buttonContainer}>
        <Button title="Update Name" onPress={handleUpdate} color="blue" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f4f4",
    flex: 1,
  },
  label: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: "#0c0c0c",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default AccountDetails;
