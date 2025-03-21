import { useState, useEffect } from "react";
import { BleManager, Device } from "react-native-ble-plx";

const bleManager = new BleManager();

const useBLE = () => {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null); // Armazenar o dispositivo selecionado

  useEffect(() => {
    checkConnectedDevices();
  }, []);

  const scanForPeripherals = async () => {
    setScanning(true);
    setErrorMessage(null);
    setAllDevices([]);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("❌ Erro ao escanear dispositivos:", error);
        setErrorMessage("Erro ao escanear dispositivos.");
        setScanning(false);
        return;
      }
      if (device?.name && !allDevices.find((d) => d.id === device.id)) {
        console.log("📡 Encontrado:", device.name);
        setAllDevices((prevDevices) => [...prevDevices, device]);
      }
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      setScanning(false);
      if (allDevices.length === 0) {
        setErrorMessage("Nenhum dispositivo encontrado.");
      }
    }, 8000);
  };

  const checkConnectedDevices = async () => {
    const devices = await bleManager.connectedDevices([]);
    console.log(
      "🔵 Dispositivos já conectados:",
      devices.map((d) => d.name)
    );
    setConnectedDevices(devices);
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log("🔗 Conectando ao dispositivo:", device.name);
      const connectedDevice = await bleManager.connectToDevice(device.id);
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
    scanForPeripherals,
    connectToDevice,
    selectedDevice, // Adiciona o dispositivo selecionado
  };
};

export default useBLE;
