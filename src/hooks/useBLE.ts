import { useState, useEffect } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import { encode as btoa } from "base-64";

const bleManager = new BleManager();

const useBLE = () => {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

  const sendCommandToDevice = async (command: string) => {
    if (!selectedDevice) {
      setErrorMessage("Nenhum dispositivo conectado.");
      return;
    }

    try {
      const base64Command = btoa(command);
      await selectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command
      );
      console.log("📤 Comando enviado:", command);
    } catch (error) {
      console.error("❌ Erro ao enviar comando:", error);
      setErrorMessage("Erro ao enviar comando.");
    }
  };

  const stopScan = () => {
    bleManager.stopDeviceScan();
    setScanning(false);
    console.log("🛑 Escaneamento interrompido.");
  };

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
        console.warn("Erro ao solicitar permissão:", err);
        return false;
      }
    }
    return true;
  };

  const scanForPeripherals = async () => {
    setAllDevices([]);
    setScanning(true);
    setErrorMessage(null);

    const discovered: { [id: string]: Device } = {};

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Erro no scan:", error);
        setErrorMessage(error.message);
        setScanning(false);
        return;
      }

      if (device?.name) {
        discovered[device.id] = device;
        setAllDevices(Object.values(discovered));
      }
    });

    setTimeout(() => {
      stopScan();
      if (Object.keys(discovered).length === 0) {
        setErrorMessage("Nenhum dispositivo encontrado.");
      }
    }, 8000);
  };

  const checkConnectedDevices = async () => {
    try {
      // O array vazio não traz nada, usar um array com UUIDs conhecidos se quiser checar
      const devices = await bleManager.devices([]);
      setConnectedDevices(devices);
    } catch (error) {
      console.error("Erro ao verificar conexões:", error);
    }
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log("🔗 Conectando ao dispositivo:", device.name);

      const connectedDevice = await bleManager.connectToDevice(device.id, {
        autoConnect: true,
      });
      await connectedDevice.discoverAllServicesAndCharacteristics();

      setConnectedDevices((prev) => {
        const exists = prev.some((d) => d.id === connectedDevice.id);
        return exists ? prev : [...prev, connectedDevice];
      });
      setSelectedDevice(connectedDevice);

      console.log("✅ Conectado:", connectedDevice.name);

      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        btoa("HELLO_TEST")
      );
      console.log("📤 Comando de teste enviado após conexão");
    } catch (error) {
      console.error("❌ Erro ao conectar ou enviar comando:", error);
      setErrorMessage("Erro ao conectar ou enviar comando.");
    }
  };

  useEffect(() => {
    checkConnectedDevices();
    const subscription = bleManager.onStateChange((state) => {
      if (state === "PoweredOff") {
        Alert.alert(
          "Bluetooth está desligado",
          "Por favor, ative o Bluetooth."
        );
      }
    }, true);

    return () => {
      subscription.remove();
      stopScan();
    };
  }, []);

  return {
    allDevices,
    connectedDevices,
    scanning,
    errorMessage,
    selectedDevice,
    scanForPeripherals,
    connectToDevice,
    stopScan,
    requestPermissions,
    sendCommandToDevice,
  };
};

export default useBLE;
