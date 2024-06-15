import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, FlatList, RefreshControl, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.MY_LISTINGS,
  },
];

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();
  const [userName, setUserName] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserName();
    setRefreshing(false);
  }, []);

  const fetchUserName = async () => {
    const db = getFirestore();
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      setUserName(userData.name);
    }
  };

  useEffect(() => {
    if (user && isFocused) {
      fetchUserName();
    }
  }, [user, isFocused]);

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={userName ? userName : ""}
          image={require("../assets/main_user.png")}
          onPress={() => navigation.navigate("AccountDetails")}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.targetScreen)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={() => logOut()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
