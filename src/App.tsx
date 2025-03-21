import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import HomeScreen from "./screens/HomeScreen";

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.topSection}>
        <HomeScreen />
      </View>
      <View style={styles.bottomSection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#023E73", // Cor de fundo da parte superior
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Ajuste para Android
  },
  topSection: {
    flex: 1, // Ocupa todo o espaço disponível, exceto o espaço da parte inferior
  },
  bottomSection: {
    height: 50, // Altura da parte inferior
    backgroundColor: "#FFFF", // Cor de fundo da parte inferior
    width: "100%", // Força a largura total
  },
});

export default App;
