import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import DeviceModal from "../components/DeviceConnectionModal";
import useBLE from "../hooks/useBLE";

const App = () => {
  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    color,
    requestPermissions,
    connectedDevices,
    scanning,
    errorMessage,
    scanForPeripherals,
    stopScan,
    selectedDevice,
  } = useBLE();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const prevConnectedDevicesRef = useRef(connectedDevices);

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

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
    stopScan();
  };

  const openModal = async () => {
    await scanForDevices();
    setIsModalVisible(true);
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.heartRateTitleWrapper}>
        {selectedDevice ? ( // Use selectedDevice em vez de connectedDevice
          <>
            <Text style={styles.heartRateTitleText}>Conectado</Text>
            <Text style={styles.heartRateText}>{selectedDevice.name}</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Por favor, conecte o Arduino
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {selectedDevice ? "Trocar Dispositivo" : "Conectar Dispositivo"}
        </Text>
      </TouchableOpacity>

      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />

      {scanning && (
        <ActivityIndicator size="large" color="#FF6060" style={styles.loader} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
    color: "black",
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 50,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  loader: {
    marginVertical: 20,
  },
});

export default App;
