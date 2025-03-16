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
import useBLE from "./useBLE";

const App = () => {
  const {
    allDevices,
    connectedDevices,
    scanning,
    errorMessage,
    scanForPeripherals,
    stopScan,
    connectToDevice,
    selectedDevice,
  } = useBLE();

  const [isScanning, setIsScanning] = useState(false);
  const prevConnectedDevicesRef = useRef([]);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);

  // Função dummy para verificar o status do Bluetooth.
  // Substitua esta lógica pela verificação real do Bluetooth.
  const checkBluetoothStatus = async () => {
    return connectedDevices.length > 0;
  };

  // Atualiza o status de conexão do Bluetooth sempre que os dispositivos conectados mudam.
  useEffect(() => {
    const checkBluetoothConnection = async () => {
      const connected = await checkBluetoothStatus();
      setIsBluetoothConnected(connected);
    };
    checkBluetoothConnection();
  }, [connectedDevices]);

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

  // Inicia o escaneamento independentemente do status de conexão
  const startScan = () => {
    setIsScanning(true);
    scanForPeripherals();
  };

  // Conecta ao dispositivo selecionado e para o escaneamento
  const handleDeviceConnect = (device) => {
    connectToDevice(device);
    setIsScanning(false);
  };

  const renderDeviceDetails = () => {
    if (!selectedDevice) return null;
    return (
      <View style={styles.deviceDetailsContainer}>
        <Text style={styles.deviceDetailsTitle}>Detalhes do Dispositivo</Text>
        <Text style={styles.deviceText}>Nome: {selectedDevice.name}</Text>
        <Text style={styles.deviceText}>ID: {selectedDevice.id}</Text>
        <Text style={styles.deviceText}>Conectado: ✅</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Controlador Placar Poliesportivo</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dispositivos Conectados</Text>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            keyExtractor={(item, index) => item.id || index.toString()}
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

      {/* Exibe os dispositivos encontrados quando estiver escaneando */}
      {isScanning && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivos Encontrados</Text>
          <FlatList
            data={allDevices}
            keyExtractor={(item, index) => item.id || index.toString()}
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

      {renderDeviceDetails()}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        onPress={startScan}
        style={styles.ctaButton}
        disabled={isScanning}
      >
        <Text style={styles.ctaButtonText}>
          {isScanning
            ? "Escaneando..."
            : connectedDevices.length > 0
            ? "Procurar outro Bluetooth"
            : "Iniciar Escaneamento"}
        </Text>
      </TouchableOpacity>

      {/* Exibe um loader se o BLE estiver escaneando (mas não se estivermos controlando o estado local) */}
      {scanning && isScanning && (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 30,
    color: "#333",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
  deviceButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  deviceText: {
    fontSize: 16,
    color: "#000",
  },
  loader: {
    marginVertical: 20,
  },
  noDeviceText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginBottom: 20,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "500",
    color: "#000",
  },
  deviceDetailsContainer: {
    borderColor: "#007AFF",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    backgroundColor: "#F9F9F9",
  },
  deviceDetailsTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#007AFF",
    marginBottom: 10,
  },
});

export default App;
