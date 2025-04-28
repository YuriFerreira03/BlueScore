import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import ConnectionBT from "./screens/ConnectionBT";
import PlacarEletronico from "./screens/PlacarEletronico";
import { BLEProvider } from "../src/hooks/BLEContext"; // importe o Provider

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("Home"); //tela de inicio

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const navigation = {
    navigate: navigateTo,
    goBack: () => navigateTo("Home"),
  };

  return (
    <BLEProvider>
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
    </BLEProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#02253D",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topSection: {
    flex: 1,
  },
});

export default App;
