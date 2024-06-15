import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import AuthContext from './auth/context';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { useProfileContext } from './auth/ProfileContext';

const MainScreen = () => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const { profileData } = useProfileContext();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  if (!isReady) return null;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <SafeAreaView style={styles.container}>
        
        <NavigationContainer>
          {user && profileData?.status === "authenticated" ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </SafeAreaView>
    </AuthContext.Provider>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
