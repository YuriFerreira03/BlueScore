import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import useBLE from "../hooks/useBLE";

const ConnectionBT = () => {
  const {
    allDevices,
    connectedDevices,
    scanning,
    errorMessage,
    scanForPeripherals,
    connectToDevice,
    selectedDevice,
  } = useBLE();

  const [isScanning, setIsScanning] = useState(false);
  const prevConnectedDevicesRef = useRef([]);

  // Exibe um alerta caso um dispositivo previamente conectado seja desconectado.
  useEffect(() => {
    if (
      prevConnectedDevicesRef.current.length > 0 &&
      connectedDevices.length === 0
    ) {
      Alert.alert(
        "Dispositivo Desconectado",
        "O dispositivo Bluetooth foi desconectado."
      );
    }
    prevConnectedDevicesRef.current = connectedDevices;
  }, [connectedDevices]);

  const startScan = () => {
    setIsScanning(true);
    scanForPeripherals();
  };

  const handleDeviceConnect = (device) => {
    connectToDevice(device);
    setIsScanning(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispositivos Bluetooth</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dispositivos Conectados</Text>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Text style={styles.deviceText}>
                ✅ {item.name || "Sem Nome"}
              </Text>
            )}
          />
        ) : (
          <Text style={styles.noDeviceText}>Nenhum dispositivo conectado.</Text>
        )}
      </View>

      {isScanning && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivos Encontrados</Text>
          <FlatList
            data={allDevices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.deviceButton}
                onPress={() => handleDeviceConnect(item)}
              >
                <Text style={styles.deviceText}>{item.name || "Sem Nome"}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {selectedDevice && (
        <View style={styles.deviceDetailsContainer}>
          <Text style={styles.deviceDetailsTitle}>Detalhes do Dispositivo</Text>
          <Text style={styles.deviceText}>Nome: {selectedDevice.name}</Text>
          <Text style={styles.deviceText}>ID: {selectedDevice.id}</Text>
          <Text style={styles.deviceText}>Conectado: ✅</Text>
        </View>
      )}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        onPress={startScan}
        style={styles.ctaButton}
        disabled={isScanning}
      >
        <Text style={styles.ctaButtonText}>
          {isScanning ? "Escaneando..." : "Iniciar Escaneamento"}
        </Text>
      </TouchableOpacity>

      {scanning && isScanning && (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "500", marginBottom: 10 },
  deviceButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  deviceText: { fontSize: 16 },
  loader: { marginVertical: 20 },
  noDeviceText: { fontSize: 16, color: "#777", textAlign: "center" },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: "#007AFF",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  ctaButtonText: { fontSize: 18, fontWeight: "500", color: "#FFF" },
  deviceDetailsContainer: {
    borderColor: "#007AFF",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  deviceDetailsTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#007AFF",
    marginBottom: 10,
  },
});

export default ConnectionBT;
