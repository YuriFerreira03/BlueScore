// App.tsx
import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import ConnectionBT from "./screens/ConnectionBT"; // Importe a tela ConnectionBT

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("Home");

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.topSection}>
        {currentScreen === "Home" && (
          <HomeScreen navigation={{ navigate: navigateTo }} />
        )}
        {currentScreen === "ConnectionBT" && (
          <ConnectionBT navigation={{ goBack: () => navigateTo("Home") }} />
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
