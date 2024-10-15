import styles from "./style.js";
import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Alert, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";

import {
    formataPerguntas,
    buscaPerguntas,
    verificaExistenciaPerguntas,
    criaPerguntaEmAvaliacaoItem,
    pegaPontuacaoUsuario,
    pegaPontuacaoTotal
} from "../services/questionarioservice";

import Pergunta from "./pergunta/pergunta.js";
import * as MediaLibrary from 'expo-media-library';

const Questionario = ({ route }) => {
    const navigate = useNavigation();
    const [perguntas, setPerguntas] = useState([]);
    const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
    const [pontuacaoUsuario, setPontuacaoUsuario] = useState(0);
    const [permission, requestPermission] = useCameraPermissions();
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();

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

    if (!permission) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>Sem permissões necessárias</Text>
            </View>
        );
    }
    
    if (!permission.granted) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>Precisamos da permissão de sua câmera</Text>
                <Button onPress={requestPermission} title="Permitir" />
            </View>
        );
    }

    if (!mediaLibraryPermission || !mediaLibraryPermission.granted) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center' }}>Precisamos da permissão para salvar fotos na galeria</Text>
                <Button onPress={requestMediaLibraryPermission} title="Permitir" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Caixa da pontuação */}
            <View style={styles.fixedPontuacaoContainer}>
                <Text style={styles.fixedPontuacao}>
                    Performance: {((pontuacaoUsuario / pontuacaoTotal) * 100).toFixed(2)}%
                </Text>
            </View>
            
            {/* ScrollView para o cabeçalho e perguntas */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Avaliação da ETE</Text>
                <Text style={styles.nomeETE}>Nome da ETE: {nomeETE}</Text>
                {/* Renderiza as perguntas */}
                <View>
                    {perguntas.map(({ id, foto, link, titulo, respostas }) => (
                        <Pergunta 
                            key={id}
                            foto={foto}
                            linkUrl={link}
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
        </View>
    );
};

export default Questionario;
