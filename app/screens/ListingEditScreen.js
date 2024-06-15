import React, { useEffect, useState } from "react";
import { Alert, Button, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import { app } from "../../FirebaseConfig";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import Screen from "../components/Screen";
import { doc, setDoc } from "firebase/firestore";


import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const validationSchema = Yup.object().shape({
	title: Yup.string().required().min(1).label("Title"),
	price: Yup.number().required().min(1).max(1000000).label("Price"),
	description: Yup.string().required().label("Description"),
	category: Yup.string().required().nullable().label("Category"),
	images: Yup.array().required().min(1, "Please select at least one image."),
	location: Yup.object().nullable().required().label("Location"),
});


function ListingEditScreen() {
	const db = getFirestore(app);
	const [uploadVisible, setUploadVisible] = useState(false);
	const [progress, setProgress] = useState(0);
	const [categoryList, setCategoryList] = useState([]);
	const [images, setImages] = useState([]);
	const [location, setLocation] = useState(null);
	const [region, setRegion] = useState({
		latitude: 24.907508,
		longitude: 67.069821,
		latitudeDelta: 0.0981,
		longitudeDelta: 0.0421,
	});
	const { user, logOut } = useAuth();
  	const [userName, setUserName] = useState(null);
	

	useEffect(() => {
		getCategoryList();
		const fetchUserName = async () => {
			const db = getFirestore();
			const userDocRef = doc(db, "users", user.uid);
			const userDocSnapshot = await getDoc(userDocRef);
			if (userDocSnapshot.exists()) {
			  const userData = userDocSnapshot.data();
			  setUserName(userData.name);
			}
		  };
	  }, []);

	  const getLocation = async (setFieldValue) => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
		  alert('Permission to access location was denied');
		  return;
		}
	  
		let location = await Location.getCurrentPositionAsync({});
		const coordinate = {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude
		}
		setLocation(coordinate);
		setRegion({
		  ...region,
		  latitude: location.coords.latitude,
		  longitude: location.coords.longitude,
		});
		setFieldValue('location',coordinate)
		
		
		
	  };

	const getCategoryList = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, "Category"));
		const categories = querySnapshot.docs.map(doc => doc.data());
		setCategoryList(categories);
	} catch (error) {
		console.error('Error fetching categories:', error);
	}
	};
	const pickImages = async (setFieldValue) => {
		try {
		  // Show options to choose from camera or gallery
		  Alert.alert(
			"Choose Image Source",
			"Select the source to pick the image from:",
			[
			  {
				text: "Camera",
				onPress: () => pickFromCamera(setFieldValue),
			  },
			  {
				text: "Gallery",
				onPress: () => pickFromGallery(setFieldValue),
			  },
			  {
				text: "Cancel",
				style: "cancel",
			  },
			],
			{ cancelable: true }
		  );
		} catch (error) {
		  console.error('Error picking images:', error);
		}
	  };
	  
	  const pickFromCamera = async (setFieldValue) => {
		try {
		  let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 1,
			allowsMultipleSelection: true,
		  });
	  
		  if (!result.canceled) {
			const selectedImages = result.assets.map(asset => asset.uri);
			const updatedImages = [...images, ...selectedImages]; // Merge new images with existing ones
			setImages(updatedImages);
			// Set selected images to the 'image' field in Formik's values
			setFieldValue('images', updatedImages);
		  }
		} catch (error) {
		  console.error('Error picking images:', error);
		}
	  };
	  
	  const pickFromGallery = async (setFieldValue) => {
		try {
		  let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 1,
			allowsMultipleSelection: true,
		  });
	  
		  if (!result.canceled) {
			const selectedImages = result.assets.map(asset => asset.uri);
			const updatedImages = [...images, ...selectedImages]; // Merge new images with existing ones
			setImages(updatedImages);
			// Set selected images to the 'image' field in Formik's values
			setFieldValue('images', updatedImages);
		  }
		} catch (error) {
		  console.error('Error picking images:', error);
		}
	  };
	  
	  const toggleImageSelection = (index, values, setFieldValue) => {
		const updatedImages = [...images];
		updatedImages.splice(index, 1);
		setImages(updatedImages);
		setFieldValue('images', updatedImages);
	  };

	  const handleSubmit = async (values, { resetForm }) => {
        try {
            // Set document in Firestore
            const docRef = doc(collection(db, "listings"));
            await setDoc(docRef, {
                ...values,
                userId: user.uid,
                createdAt: new Date()
            });
            // Reset form and other states if necessary
            resetForm();
            setImages([]);
            setLocation(null);
            alert('Listing posted successfully!');
        } catch (error) {
            console.error('Error posting listing:', error);
            alert('Error posting listing, please try again.');
        }
    };

	return (
		<Screen style={styles.container}>
			<KeyboardAvoidingView
        		behavior={Platform.OS === "android" ? "padding" : "height"}
        		style={styles.keyboardAvoidingView}
      		>
			<ScrollView>		
		  <Formik
			initialValues={{
			  title: "",
			  price: "",
			  description: "",
			  category: "",
			  images: [],
			  location: null
			}}
			onSubmit={handleSubmit}
			validationSchema={validationSchema}
		  >
			{({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
			  <>
				<TouchableOpacity onPress={() => pickImages(setFieldValue)} style={styles.imageContainer}>
					<Text style={{fontWeight: 'bold', color: 'blue'}}>Select Images</Text>
              <Image
                source={require('./../assets/ImagePlaceholder.jpg')}
                style={styles.placeholderImage}
              />
              <ScrollView horizontal>
                {images.map((image, index) => (
                  <TouchableOpacity key={index} onPress={() => toggleImageSelection(index, values, setFieldValue)}>
                    <Image source={{ uri: image }} style={styles.image} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
			{touched.images && errors.images && (
				  <Text style={styles.error}>{errors.images}</Text>
				)}
	  
				<TextInput
				  style={styles.input}
				  placeholder="Title"
				  onChangeText={handleChange("title")}
				  value={values.title}
				/>
				{touched.title && errors.title && (
				  <Text style={styles.error}>{errors.title}</Text>
				)}
	  
				<TextInput
				  style={[styles.input, { width: 120 }]}
				  placeholder="Price"
				  keyboardType="numeric"
				  onChangeText={handleChange("price")}
				  value={values.price}
				/>
				{touched.price && errors.price && (
				  <Text style={styles.error}>{errors.price}</Text>
				)}
	  
				<TextInput
				  style={[styles.input, styles.textArea]}
				  placeholder="Description"
				  multiline
				  numberOfLines={10}
				  onChangeText={handleChange("description")}
				  value={values.description}
				/>
				{touched.description && errors.description && (
				  <Text style={styles.error}>{errors.description}</Text>
				)}
				<Text style={{fontWeight: 'bold', color: 'blue'}}>Select Company</Text>
				<View style={styles.pickerContainer}>	
				<Picker
                selectedValue={values?.category}
                onValueChange={itemValue => setFieldValue('category', itemValue)}
              	>
                {categoryList && categoryList.map((item, index) => (
                  <Picker.Item key={index} label={item?.name} value={item?.name} />
                ))}
              	</Picker>
			  	</View>
				{touched.category && errors.category && (
				  <Text style={styles.error}>{errors.category}</Text>
				)}

			<MapView
                style={styles.map}
                region={region}
                onPress={(e) => {
                  const coords = e.nativeEvent.coordinate;
                  setRegion({
                    ...region,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                  });
                  setLocation(coords);
                  setFieldValue('location', coords);
				  console.log(coords)
                }}
              >
                {location && <Marker coordinate={location} />}
              </MapView>
			  {touched.location && errors.location && (
				  <Text style={styles.error}>{errors.location}</Text>
				)}
			  <TouchableOpacity onPress={() =>getLocation(setFieldValue)} style={styles.submitButton}>
                	<Text style={styles.submitText}>Get Location</Text>
              	</TouchableOpacity>
	  
	  			<TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                	<Text style={styles.submitText}>Post</Text>
              	</TouchableOpacity>
			  </>
			)}
		  </Formik>
		  </ScrollView>
		 </KeyboardAvoidingView> 
		</Screen>
	  );
	  
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	error: {
		color: 'red'
	},
	map: {
		width: '100%',
		height: 200,
		marginVertical: 20,
	  },
	placeholderImage: {
		width: 100,
		height: 100,
		borderRadius: 10,
		marginBottom: 5,
	  },
	  image: {
		width: 100,
		height: 100,
		borderRadius: 10,
		marginBottom: 5,
		marginRight: 5,
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
	  pickerContainer: {
		borderWidth: 1,
		borderRadius: 10,
		marginTop: 15,
	  },
});

export default ListingEditScreen;
