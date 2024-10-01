import styles from "./style.js";

import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { 
    formataPerguntas,
    buscaPerguntas,
    verificaExistenciaPerguntas,
    criaPerguntaEmAvaliacaoItem,
    pegaPontuacaoUsuario,
    pegaPontuacaoTotal
} from "../services/questionarioservice";

import Pergunta from "./pergunta/pergunta.js";

const Questionario = ({ route }) => {
    const navigate = useNavigation();
    const [perguntas, setPerguntas] = useState([]);
    const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
    const [pontuacaoUsuario, setPontuacaoUsuario] = useState(0);

    const codAval = route.params.codAval;
    const nomeETE = route.params.nomeETE;

    const recarregaPerguntas = async () => {
        const resposta = await buscaPerguntas(codAval);
        const perguntasFormatadas = formataPerguntas(resposta);
        const pontuacaoUsuario = await pegaPontuacaoUsuario(codAval);
        
        setPontuacaoUsuario(pontuacaoUsuario);
        setPerguntas(perguntasFormatadas);
    }

    const fetchData = async () => {
        try {
            const resposta = await buscaPerguntas(codAval);
            const perguntasFormatadas = formataPerguntas(resposta);

            const pontuacaoUsuario = await pegaPontuacaoUsuario(codAval);
            const pontuacaoTotal = await pegaPontuacaoTotal();

            // Verifica se já existem perguntas inseridas para essa avaliação
            const perguntasExistentes = await verificaExistenciaPerguntas(codAval);

            if (!perguntasExistentes) {
                await criaPerguntaEmAvaliacaoItem(codAval, perguntasFormatadas);
            }

            setPontuacaoTotal(pontuacaoTotal);
            setPontuacaoUsuario(pontuacaoUsuario);
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
            <Text>Nome da ETE: {nomeETE}</Text>
            <Text>Pontuacao: {((pontuacaoUsuario/pontuacaoTotal) * 100).toFixed(2)}%</Text>
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




