import styles from "./style.js";

import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { 
    formataPerguntas,
    buscaPerguntas,
    verificaExistenciaPerguntas,
    criaPerguntaEmAvaliacaoItem
} from "../services/questionarioservice";

import Pergunta from "./pergunta/pergunta.js";

const Questionario = ({ route }) => {
    const navigate = useNavigation();
    const [perguntas, setPerguntas] = useState([]);
    const codAval = route.params.codAval;

    const recarregaPerguntas = async () => {
        const resposta = await buscaPerguntas(codAval);
        const perguntasFormatadas = formataPerguntas(resposta);
        setPerguntas(perguntasFormatadas);
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
            {/* Título adicionado aqui */}
            <Text style={styles.header}>Avaliação da IQE</Text>

            {/* Renderiza as perguntas */}
            <View>
                {perguntas.map(({id, foto, titulo, respostas}) => (
                    <Pergunta 
                        key={id}
                        foto={foto}
                        titulo={titulo} 
                        respostas={respostas} 
                        codAval={codAval} 
                        codInd={id}
                        recarregaPerguntas={recarregaPerguntas}
                    />
                ))}
            </View>

            {/* Botão de "Voltar" movido para o fim da página */}
            <TouchableOpacity style={styles.button} onPress={() => navigate.goBack()}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Questionario;




