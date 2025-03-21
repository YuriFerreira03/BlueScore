import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Importando ícones

const HomeScreen: React.FC = () => {
  const buttons = [
    { id: 1, label: "Controlar Placar", icon: "scoreboard" },
    { id: 2, label: "Preencher Súmula", icon: "file-document-edit" },
    { id: 3, label: "Histórico Jogos", icon: "history" },
    { id: 4, label: "Construir Tabela", icon: "table-large" },
    { id: 5, label: "Sortear Times", icon: "shuffle-variant" },
    { id: 6, label: "Consultar Regulamentos", icon: "book-open-variant" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#023E73" barStyle="light-content" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require("../Image/logo.png")} style={styles.logo} />
          <Text style={styles.headerTitle}>BEM VINDO AO</Text>
          <Text style={styles.headerSubtitle}>BT SCORE</Text>
        </View>

        <View style={styles.container1}>
          <View style={styles.buttonGrid}>
            {buttons.map((btn) => (
              <TouchableOpacity key={btn.id} style={styles.button}>
                <MaterialCommunityIcons
                  name={btn.icon}
                  size={32}
                  color="white"
                />
                <Text style={styles.buttonText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#023E73",
  },
  container: {
    flex: 1,
    backgroundColor: "#023E73",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  headerTitle: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#A0AEC0",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 40,
  },
  container1: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%", // Garante que ocupe toda a largura
  },
  button: {
    backgroundColor: "#023E73",
    width: "45%",
    height: 120,
    marginBottom: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 8,
  },
});

export default HomeScreen;
