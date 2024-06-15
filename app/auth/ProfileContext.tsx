import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useContext, useEffect, useState} from 'react';

const ProfileContext = createContext<any | null>(null);
const useProfileContext = () => useContext(ProfileContext);

const ProfileContextProvider = ({children}: any) => 
{
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem('profile').then((data: any) => {
      if (data) {
        setProfileData(JSON.parse(data));
      } else setProfileData({status: ""});
    });
  }, []);

  const updateProfileData = (data: any) => {
    setProfileData(data);
    AsyncStorage.setItem('profile', JSON.stringify(data));
  };

  return (
    <ProfileContext.Provider value={{profileData, updateProfileData}}>
      {children}
    </ProfileContext.Provider>
  );
};

export {ProfileContextProvider, useProfileContext};
