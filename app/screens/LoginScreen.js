import React, { useContext, useState } from "react";
import { StyleSheet, Image, TextInput, Modal, View, Text, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import Screen from "../components/Screen";
import ActivityIndicator from "../components/ActivityIndicator";
import { useProfileContext } from "../auth/ProfileContext";



const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

function LoginScreen() {

  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const {profileData, updateProfileData} = useProfileContext();

  

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      updateProfileData({status: "authenticated"});
      console.log(profileData);
      setLoginFailed(false);
      setError("");
      setModalVisible(false);
      
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setError("Incorrect Credentials.");
      } else {
        console.error("Login failed:", error);
        setError("Login failed. Please try again.");
      }
      setLoginFailed(true);
      setModalVisible(true);
    }

    setLoading(false);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleSubmit, errors, touched, setFieldTouched }) => (
            <>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Email"
                textContentType="emailAddress"
                keyboardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={() => setFieldTouched("email")}
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <TextInput
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Password"
                textContentType="password"
                secureTextEntry={true}
                onChangeText={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
              />
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

              <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitText}>Login</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </Screen>

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
            <Text style={styles.modalText}>{error}</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
  input: {
    height: 60,
    borderColor: "gray",
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default LoginScreen;
