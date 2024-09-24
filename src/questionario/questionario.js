import styles from "./style.js";

import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { 
    formataPerguntas,
    atualizaResposta,
    buscaPerguntas
} from "../services/questionarioservice";

import {
    MaterialCommunityIcons,
    Feather,
    Ionicons,
    AntDesign,
} from "@expo/vector-icons";

import CameraComponent from "./cameracomp/cameracomp.js";

const Questionario = ({ route }) => {
    const navigate = useNavigation();
    const [perguntas, setPerguntas] = useState([]);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [showImageSettings, setShowImageSettings] = useState(false);
    const codAval = route.params.codAval;

    // Função para lidar com o clique em uma resposta
    const handleRespostaClick = async (codAval, codInd, codAvalPeso) => {
        try {
            // Atualiza a resposta no banco de dados
            await atualizaResposta(codAval, codInd, codAvalPeso);

            // Recarrega as perguntas
            const resposta = await buscaPerguntas(codAval);
            const perguntasFormatadas = formataPerguntas(resposta);
            setPerguntas(perguntasFormatadas);
        } catch (error) {
            console.error("Erro ao atualizar a resposta: ", error);
        }
    };

    const fetchData = async () => {
        try {
            const resposta = await buscaPerguntas(codAval);
            const perguntasFormatadas = formataPerguntas(resposta);
            setPerguntas(perguntasFormatadas);
        } catch (err) {
            console.error(err);
            Alert.alert("Erro", "Erro ao carregar perguntas.");
        }
    };

    const handleOpenCamera = () => {
        setCameraVisible(true);
    };

    const handleCloseCamera = () => {
        setCameraVisible(false);
    };

    const handlePhotoTaken = (photoUri) => {
        setCapturedPhoto(photoUri);
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
                {perguntas.map((pergunta) => (
                    <View key={pergunta.id} style={styles.listItem}>
                        <Text style={styles.label}>
                            {pergunta.titulo}
                        </Text>
                        <View style={styles.respostasContainer}>
                            {pergunta.respostas.map((resposta, indexResposta) => (
                                <TouchableOpacity
                                    key={indexResposta}
                                    style={styles.radioButtonContainer}
                                    onPress={() => handleRespostaClick(codAval, pergunta.id, resposta.codAvalPeso)}
                                >
                                    <View style={[styles.radioButton, resposta.escolhida ? styles.radioButtonSelected : null]} />
                                    <Text style={styles.radioButtonLabel}>
                                        {resposta.texto}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {capturedPhoto && (
                            <TouchableOpacity onPress={handleOpenCamera}>
                                <Image
                                source={{ uri: capturedPhoto }}
                                resizeMode="contain"
                                style={{ width: '100%', height: '100%' }} // Ajuste conforme necessário
                                />
                                <MaterialCommunityIcons
                                name="dots-horizontal-circle"
                                size={20}
                                color="red"
                                // style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                            )}
                            {!capturedPhoto && (
                            <TouchableOpacity onPress={handleOpenCamera}>
                                <MaterialCommunityIcons name="camera-plus-outline" size={50} color="black" />
                            </TouchableOpacity>
                            )}

                        <CameraComponent
                            visible={cameraVisible}
                            setCameraVisible={setCameraVisible}
                            onClose={handleCloseCamera}
                            onPhotoTaken={handlePhotoTaken}
                            capturedPhoto={capturedPhoto}
                            codAval={codAval}
                            codInd={pergunta.id}
                        /> 
                    </View>
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




