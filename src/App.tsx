// App.tsx
import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import ConnectionBT from "./screens/ConnectionBT";
import PlacarEletronico from "./screens/PlacarEletronico";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("PlacarEletronico"); //pagina entrada

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const navigation = {
    navigate: navigateTo,
    goBack: () => navigateTo("Home"),
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.topSection}>
        {currentScreen === "Home" && <HomeScreen navigation={navigation} />}
        {currentScreen === "ConnectionBT" && (
          <ConnectionBT navigation={navigation} />
        )}
        {currentScreen === "PlacarEletronico" && (
          <PlacarEletronico navigation={navigation} />
        )}
      </View>
      <View style={styles.bottomSection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#023E73",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topSection: {
    flex: 1,
  },
  bottomSection: {
    height: 50,
    backgroundColor: "#FFFF",
    width: "100%",
  },
});

export default App;
