import styles from "./style.js";

import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { 
    resetarAvaliacaoItem, 
    criaPerguntaEmAvaliacaoItem, 
    verificaExistenciaPerguntas, 
    formataPerguntas,
    atualizaResposta,
    buscaPerguntas
} from "../services/questionarioservice";

const Questionario = ({ route }) => {
    const navigate = useNavigation();
    const [perguntas, setPerguntas] = useState([]);
    const codAval = route.params.codAval;

    // Função para lidar com o clique em uma resposta
    const handleRespostaClick = async (codAval, codInd, codAvalPeso) => {
        try {
            // Chama o serviço para atualizar a resposta no banco de dados
            await atualizaResposta(codAval, codInd, codAvalPeso);

            // Recarrega as perguntas
            const resposta = await buscaPerguntas(codAval);
            const perguntasFormatadas = formataPerguntas(resposta);
            setPerguntas(perguntasFormatadas);
            
        } catch (error) {
            console.error("Erro ao atualizar a resposta: ", error);
        }
    };

    const handleRespostaReset = async () => {
        try{
            await resetarAvaliacaoItem(codAval);

            await fetchData();
        } catch (error) {
            console.error("Erro ao resetar as respostas: ", error);
        }
    }

    const fetchData = async () => {
        try {
            const resposta = await buscaPerguntas(codAval);
            const perguntasFormatadas = formataPerguntas(resposta);

            // Verifica se já existem perguntas inseridas para essa avaliação
            const perguntasExistentes = await verificaExistenciaPerguntas(codAval);

            if (!perguntasExistentes) {
                await criaPerguntaEmAvaliacaoItem(codAval, perguntasFormatadas);
            }

            setPerguntas(perguntasFormatadas);
        } catch (err) {
            console.error(err);

            Alert.alert("Erro", "Erro ao carregar perguntas.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={{ padding: 50 }} onPress={() => navigate.goBack()}>
                <Text>Voltar</Text>
            </TouchableOpacity>
            
            <Text style={{ color: "#000", textAlign: "center", fontWeight: "bold" }}>
                Avaliação com código: {codAval}
            </Text>
            <TouchableOpacity
                style={{ backgroundColor: 'red', margin: 5, padding: 10 }}
                onPress={() => handleRespostaReset()}
            >
                <Text style={{ color: "#fff" }}>
                    Resetar respostas
                </Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: 'yellow', flex: 1 }}>
                {perguntas.map((pergunta) => (
                    <View key={pergunta.id} style={{ backgroundColor: "red", margin: 10 }}>
                        <Text style={{ color: "#fff", backgroundColor: 'green' }}>
                            {pergunta.id} {pergunta.titulo}
                        </Text>
                        {pergunta.respostas.map((resposta, indexResposta) => (
                            <TouchableOpacity
                                key={indexResposta}
                                style={{ backgroundColor: resposta.escolhida ? 'blue': 'gray', margin: 5, padding: 10 }}
                                onPress={() => handleRespostaClick(codAval, pergunta.id, resposta.codAvalPeso)}
                            >
                                <Text style={{ color: "#fff" }}>
                                    {resposta.texto}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default Questionario;
