import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = 
{
  apiKey: "AIzaSyCqCpS2NkOFfgVnabdTVIfzMOdso2NaUjM",
  authDomain: "react-project-48806.firebaseapp.com",
  projectId: "react-project-48806",
  storageBucket: "react-project-48806.appspot.com",
  messagingSenderId: "404840575734",
  appId: "1:404840575734:web:c67535ee5c30346ac372d7",
  measurementId: "G-5B8GVB92FY"
};

// Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });

export { app, auth };
