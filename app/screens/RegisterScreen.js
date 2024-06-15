import React, { useContext, useState } from "react";
import { StyleSheet, TextInput, View, Text, TouchableOpacity, Modal, Button } from "react-native";
import { Formik } from 'formik';
import * as Yup from "yup";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile } from "firebase/auth";
import ActivityIndicator from "../components/ActivityIndicator";
import Screen from "../components/Screen";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../FirebaseConfig";



const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

function RegisterScreen() {
  const db = getFirestore(app);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  
  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const auth = getAuth();
    
    try {
      // Create user in Firebase Authentication
      const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      // Update user profile with name
      await updateProfile(auth.currentUser, {
        displayName: values.name
      });
  
      // Save user details to Firestore database
      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: values.email
      });
      
      setSuccess("User registered successfully.");
      setError(null);
      setModalVisible(true);
    } 
    catch (error) 
    {
      if (error.code === 'auth/email-already-in-use') {
        setError("User already registered. Please log in.");
      } else {
        console.error("Registration failed:", error);
        setError("Registration failed. Please try again.");
      }
      setModalVisible(true);
    }
  
    setLoading(false);
  };
  
  

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.container}>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleSubmit, errors, touched, setFieldTouched }) => (
            <>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    {success ? (
                      <Text style={styles.modalText}>{success}</Text>
                    ) : (
                      <Text style={styles.modalText}>{error}</Text>
                    )}
                    <Button
                      title="Close"
                      onPress={() => setModalVisible(!modalVisible)}
                    />
                  </View>
                </View>
              </Modal>

              <TextInput
                style={styles.input}
                placeholder="Name"
                autoCorrect={false}
                onChangeText={handleChange("name")}
                onBlur={() => setFieldTouched("name")}
              />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={() => setFieldTouched("email")}
                textContentType="emailAddress"
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
              <TextInput
                style={styles.input}
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
                textContentType="password"
              />
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    height: 60,
    borderColor: "gray",
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  success: {
    color: "green",
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: 'blue',
    borderRadius: 30,
  },
  submitText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default RegisterScreen;
