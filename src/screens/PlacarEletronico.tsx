import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

const PlacarEletronico = ({ navigation }) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Placar Eletrônico</Text>

      {/* Container principal (Equipe A e Equipe B) */}
      <View style={styles.mainContainer}>
        {/* Equipe A */}
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>Equipe A</Text>
          <Text style={styles.info}>Pontos: {pontosA}</Text>
          <Text style={styles.info}>Set/Faltas: {setFaltasA}</Text>
          <Text style={styles.info}>Pedido de Tempo: {pedidoTempoA}</Text>
          <Text style={styles.info}>Serviço: {servicoA}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setPontosA(pontosA + 1)}
          >
            <Text style={styles.buttonText}>+1 Ponto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSetFaltasA(setFaltasA + 1)}
          >
            <Text style={styles.buttonText}>+1 Set/Falta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setPedidoTempoA(pedidoTempoA + 1)}
          >
            <Text style={styles.buttonText}>+1 Pedido de Tempo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={alternarServico}>
            <Text style={styles.buttonText}>Alternar Serviço</Text>
          </TouchableOpacity>
        </View>

        {/* Equipe B */}
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>Equipe B</Text>
          <Text style={styles.info}>Pontos: {pontosB}</Text>
          <Text style={styles.info}>Set/Faltas: {setFaltasB}</Text>
          <Text style={styles.info}>Pedido de Tempo: {pedidoTempoB}</Text>
          <Text style={styles.info}>Serviço: {servicoB}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setPontosB(pontosB + 1)}
          >
            <Text style={styles.buttonText}>+1 Ponto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSetFaltasB(setFaltasB + 1)}
          >
            <Text style={styles.buttonText}>+1 Set/Falta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setPedidoTempoB(pedidoTempoB + 1)}
          >
            <Text style={styles.buttonText}>+1 Pedido de Tempo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Controles Gerais */}
      <View style={styles.controlsContainer}>
        <Text style={styles.info}>Cronômetro: {cronometro}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCronometro("05:00")} // Exemplo de ajuste do cronômetro
        >
          <Text style={styles.buttonText}>Iniciar Cronômetro</Text>
        </TouchableOpacity>

        <Text style={styles.info}>Alarme: {alarme}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setAlarme(alarme === "Ligado" ? "Desligado" : "Ligado")
          }
        >
          <Text style={styles.buttonText}>
            {alarme === "Ligado" ? "Desligar Alarme" : "Ligar Alarme"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.info}>Período: {periodo}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setPeriodo(periodo === "1º Período" ? "2º Período" : "1º Período")
          }
        >
          <Text style={styles.buttonText}>Alternar Período</Text>
        </TouchableOpacity>
      </View>

      {/* Botões de Reset e Voltar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetarPlacar}>
          <Text style={styles.buttonText}>Resetar Placar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  teamContainer: {
    width: "48%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  controlsContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resetButton: {
    backgroundColor: "#FF6060",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#FF6060",
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PlacarEletronico;
