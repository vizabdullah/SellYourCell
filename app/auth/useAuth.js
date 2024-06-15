import { useContext } from "react";
import jwtDecode from "jwt-decode";

import AuthContext from "./context";
import authStorage from "./storage";
import { useProfileContext } from "./ProfileContext";
import { getAuth, signOut } from "firebase/auth";

export default useAuth = () => {
	const { user, setUser} = useContext(AuthContext);
	const {profileData, updateProfileData} = useProfileContext(); 
	const auth = getAuth();

	const logIn = (authToken) => {
		const user = jwtDecode(authToken);
		setUser(user);
		authStorage.storeToken(authToken);
	};

	const logOut = async () => {
		try {
			await signOut(auth);
			setUser(null);
			updateProfileData({ status: "NotAuthenticated" });
			authStorage.removeToken();
		} catch (error) {
			console.error("Error signing out: ", error);
		}
	};
	

	return { user, logIn, logOut};
};
