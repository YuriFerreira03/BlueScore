import { useState, useEffect } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";

const bleManager = new BleManager();

const useBLE = () => {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Função para parar o escaneamento
  const stopScan = () => {
    bleManager.stopDeviceScan();
    setScanning(false);
    console.log("Escaneamento interrompido.");
  };

  // Verifica dispositivos conectados ao iniciar
  useEffect(() => {
    checkConnectedDevices();
    const subscription = bleManager.onStateChange((state) => {
      if (state === "PoweredOff") Alert.alert("Ligue o Bluetooth");
    }, true);

    return () => {
      subscription.remove();
      stopScan(); // Garante que o escaneamento seja interrompido ao desmontar
    };
  }, []);

  // Solicita permissões do Android
  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permissão de Localização",
            message: "Necessária para conexão Bluetooth",
            buttonNeutral: "Perguntar depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // Para iOS
  };

  // Escaneamento de dispositivos
  const scanForPeripherals = async () => {
    setAllDevices([]); // Limpa a lista antes de escanear
    setScanning(true);
    setErrorMessage(null);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Erro:", error);
        setErrorMessage(error.message);
        setScanning(false);
        return;
      }

      if (device?.name) {
        // Verifica se o dispositivo já está na lista
        setAllDevices((prevDevices) => {
          const deviceExists = prevDevices.some((d) => d.id === device.id);
          if (!deviceExists) {
            return [...prevDevices, device]; // Adiciona apenas se não existir
          }
          return prevDevices; // Mantém a lista original
        });
      }
    });

    setTimeout(() => {
      stopScan();
      if (allDevices.length === 0) {
        setErrorMessage("Nenhum dispositivo encontrado.");
      }
    }, 8000);
  };

  // Verifica conexões existentes
  const checkConnectedDevices = async () => {
    try {
      const devices = await bleManager.connectedDevices([]);
      setConnectedDevices(devices);
    } catch (error) {
      console.log("Erro ao verificar conexões:", error);
    }
  };

  // Conexão com dispositivo
  const connectToDevice = async (device: Device) => {
    try {
      console.log("🔗 Conectando ao dispositivo:", device.name);
      const connectedDevice = await bleManager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics(); // Descobre serviços e características

      // Atualiza o estado do dispositivo conectado
      setConnectedDevices((prevDevices) => [...prevDevices, connectedDevice]);
      setSelectedDevice(connectedDevice); // Armazena o dispositivo selecionado

      console.log("✅ Conectado:", connectedDevice.name);
    } catch (error) {
      console.log("❌ Erro ao conectar:", error);
      setErrorMessage("Erro ao conectar ao dispositivo.");
    }
  };

  return {
    allDevices,
    connectedDevices,
    scanning,
    errorMessage,
    selectedDevice,
    scanForPeripherals,
    connectToDevice,
    stopScan, // Exporta a função stopScan
    requestPermissions,
  };
};

export default useBLE;
