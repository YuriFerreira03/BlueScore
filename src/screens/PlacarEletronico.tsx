import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBLEContext } from "../hooks/BLEContext";
import { Buffer } from "buffer"; // Importando o Buffer do pacote 'buffer'

const PlacarEletronico = ({ navigation }) => {
  const { sendCommandToDevice, selectedDevice } = useBLEContext();

  //adicionar um log para ver se o selectDevice está correto
  // console.log("selectedDevice:", selectedDevice);

  // Estados para a Equipe A
  const [pontosA, setPontosA] = useState(0);
  const [setFaltasA, setSetFaltasA] = useState(0);
  const [pedidoTempoA, setPedidoTempoA] = useState(0);
  const [servicoA, setServicoA] = useState("Não");

  // Estados para a Equipe B
  const [pontosB, setPontosB] = useState(0);
  const [setFaltasB, setSetFaltasB] = useState(0);
  const [pedidoTempoB, setPedidoTempoB] = useState(0);
  const [servicoB, setServicoB] = useState("Não");

  // Estados para o cronômetro, alarme e período
  const [cronometro, setCronometro] = useState("00:00");
  const [alarme, setAlarme] = useState("Desligado");
  const [periodo, setPeriodo] = useState("1º Período");

  // Função para alternar o serviço entre as equipes
  const alternarServico = () => {
    if (servicoA === "Sim") {
      setServicoA("Não");
      setServicoB("Sim");
    } else {
      setServicoA("Sim");
      setServicoB("Não");
    }
  };

  // Função para resetar o placar
  const resetarPlacar = () => {
    setPontosA(0);
    setSetFaltasA(0);
    setPedidoTempoA(0);
    setServicoA("Não");

    setPontosB(0);
    setSetFaltasB(0);
    setPedidoTempoB(0);
    setServicoB("Não");

    setCronometro("00:00");
    setAlarme("Desligado");
    setPeriodo("1º Período");
  };

  /**
   * Envia um único byte de comando ao ESP32 via BLE.
   * O byte será enviado em Base64, que é o formato que a biblioteca BLE espera.
   */
  function arrayBufferToBase64(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function sendCmd(cmd) {
    if (!selectedDevice) {
      console.warn("Nenhum dispositivo conectado.");
      return;
    }
    try {
      await sendCommandToDevice(cmd);
    } catch (e) {
      console.error("Falha ao enviar comando", e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* <View style={styles.placarResumoContainer}> */}
        <Text style={styles.teamName}>CONTROLADOR</Text>

        <View style={styles.row}>
          {/* Equipe A */}
          <View style={styles.resumoEquipe}>
            <Text style={styles.info}>Equipe A</Text>
            <Text style={styles.info}>Pontos: {pontosA}</Text>
            <Text style={styles.info}>Set/Faltas: {setFaltasA}</Text>
            <Text style={styles.info}>P. Tempo: {pedidoTempoA}</Text>
            <Text style={styles.info}>Serviço: {servicoA}</Text>
          </View>

          {/* Equipe B */}
          <View style={styles.resumoEquipe}>
            <Text style={styles.info}>Equipe B</Text>
            <Text style={styles.info}>Pontos: {pontosB}</Text>
            <Text style={styles.info}>Set/Faltas: {setFaltasB}</Text>
            <Text style={styles.info}>P. Tempo: {pedidoTempoB}</Text>
            <Text style={styles.info}>Serviço: {servicoB}</Text>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <View style={styles.resumoEquipe1}>
            <Text style={styles.info}>Cronômetro: {cronometro}</Text>
            <Text style={styles.info}>Alarme: {alarme}</Text>
            <Text style={styles.info}>Período: {periodo}</Text>
          </View>
        </View>
        {/* </View> */}

        <View style={styles.mainContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              flex: 1,
            }}
          >
            {/*fazer um container para mostrador de placar*/}

            <View style={styles.mainContainer}>
              {/* Equipe A */}
              <View style={styles.teamContainer}>
                <Text style={styles.teamName}>EQUIPE A</Text>

                {/* SET/FALTAS */}
                <View style={styles.section}>
                  <TouchableOpacity
                    style={styles.circleButton}
                    onPress={() => {}}
                  />
                  <Text style={styles.info}>SET/FALTAS</Text>
                </View>

                {/* SERVIÇO e TEMPO */}
                <View style={styles.row}>
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => {}}
                    />
                    <Text style={styles.info}>SERV</Text>
                  </View>
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => {}}
                    />
                    <Text style={styles.info}>P. TEMP</Text>
                  </View>
                </View>

                {/* +1 e -1 PONTOS */}
                <View style={styles.row}>
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={async () => {
                        setPontosA(pontosA + 1);
                        await sendCmd(0x01); // comando +1 ponto A
                      }}
                    />
                    <Text style={styles.info}>+1</Text>
                  </View>
                  <Text style={styles.pointsTitle}>PONTOS</Text>
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={async () => {
                        setPontosA(pontosA - 1);
                        await sendCmd(0x02); // comando -1 ponto A
                      }}
                    />
                    <Text style={styles.info}>-1</Text>
                  </View>
                </View>
              </View>

              {/* Equipe B */}
              <View style={styles.teamContainer}>
                <Text style={styles.teamName}>EQUIPE B</Text>

                {/* SET/FALTAS */}
                <View style={styles.section}>
                  <TouchableOpacity
                    style={styles.circleButton}
                    onPress={() => {}}
                  />
                  <Text style={styles.info}>SET/FALTAS</Text>
                </View>

                {/* SERVIÇO e TEMPO */}
                <View style={styles.row}>
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => {}}
                    />
                    <Text style={styles.info}>SERV</Text>
                  </View>
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => {}}
                    />
                    <Text style={styles.info}>P. TEMP</Text>
                  </View>
                </View>

                {/* +1 e -1 PONTOS */}
                <View style={styles.row}>
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => {}}
                    />
                    <Text style={styles.info}>+1</Text>
                  </View>
                  <Text style={styles.pointsTitle}>PONTOS</Text>
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.circleButton}
                      onPress={() => {}}
                    />
                    <Text style={styles.info}>-1</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.geralContainer}>
          <View style={styles.section}>
            <TouchableOpacity style={styles.circleButton} onPress={() => {}} />
            <Text style={styles.info}>CRONÔMETRO</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => {}}
              />
              <Text style={styles.info}>ALARME</Text>
            </View>
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => {}}
              />
              <Text style={styles.info}>PRESET</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#02253D",
    padding: 8,
    marginTop: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#003366", // azul escuro CEFET
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  teamContainer: {
    backgroundColor: "#06568F", // azul forte bonito
    borderRadius: 20,
    padding: 20,
    width: 185,
    margin: 10,
    marginTop: 20,
    height: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  circleButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  servico: {
    width: "40%",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    marginTop: -10,
    marginLeft: "31%",
  },
  teamName: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    alignItems: "center",
  },
  info: {
    fontSize: 17,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  placarResumoContainer: {
    backgroundColor: "#02253D", // azul forte bonito
    borderRadius: 20,
    height: 280,
    padding: 20,
    marginHorizontal: 20,
    marginTop: -10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 5,
  },
  resumoEquipe: {
    flex: 1,
    backgroundColor: "#06568F", // azul forte bonito
    borderRadius: 10,
    padding: 10,
    marginTop: -10,
    marginHorizontal: 4,
    alignItems: "center",
    gap: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 3,
    borderColor: "#FFFFFF", // Borda branca
  },
  resumoEquipe1: {
    width: "100%", // ocupa a largura total do container
    backgroundColor: "#06568F",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: -16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 3,
    borderColor: "#FFFFFF", // Borda branca
    shadowColor: "#000", // Cor da sombra
  },
  geralContainer: {
    backgroundColor: "#06568F", // azul forte bonito
    borderRadius: 20,
    padding: 20,
    width: 300,
    margin: 40,
    marginTop: 2,
    height: 160,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 8,
  },
  pointsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: -20,
    marginHorizontal: 10,
  },
});

export default PlacarEletronico;
