import { useState } from "react";
import styles from "./style"

import {
    MaterialCommunityIcons,
    Feather,
    Ionicons,
    AntDesign,
} from "@expo/vector-icons";

import { View, TouchableOpacity, Text, Image } from "react-native";

import { atualizaResposta } from "../../services/questionarioservice";

import Camera from "../camera/camera";

const Pergunta = ({ titulo, foto, respostas, codAval, codInd, recarregaPerguntas }) => {

    const [cameraVisible, setCameraVisible] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(foto ? foto : null);
    
    // Função para lidar com o clique em uma resposta
    const handleRespostaClick = async (codAval, codInd, codAvalPeso) => {
        try {
            // Atualiza a resposta no banco de dados
            await atualizaResposta(codAval, codInd, codAvalPeso);

            // Atualiza a tela com o novo estado das perguntas
            recarregaPerguntas();
        } catch (error) {
            console.error("Erro ao atualizar a resposta: ", error);
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

    return (
        <View style={styles.listItem}>
            <Text style={styles.label}>
                {titulo}
            </Text>
            <View style={styles.respostasContainer}>
                {respostas.map((resposta, indexResposta) => (
                    <TouchableOpacity
                        key={indexResposta}
                        style={styles.radioButtonContainer}
                        onPress={() => handleRespostaClick(codAval, codInd, resposta.codAvalPeso)}
                    >
                        <View style={[styles.radioButton, resposta.escolhida ? styles.radioButtonSelected : null]} />
                        <Text style={styles.radioButtonLabel}>
                            {resposta.texto}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {capturedPhoto && (
                <TouchableOpacity style={styles.buttonCamera} onPress={() => handleOpenCamera()}>
                    <Image
                        source={{ uri: capturedPhoto }}
                        resizeMode="contain"
                        style={{ width: '100%', height: '100%' }} // Ajuste conforme necessário
                    />
                    <MaterialCommunityIcons
                        name="dots-horizontal-circle"
                        size={20}
                        color="red"
                        style={styles.closeIcon}
                    />
                </TouchableOpacity>
            )}
            {!capturedPhoto && (
                <TouchableOpacity style={styles.buttonCamera} onPress={() => handleOpenCamera()}>
                    <MaterialCommunityIcons name="camera-plus-outline" size={50} color="black" />
                </TouchableOpacity>
            )}

            <Camera
                visible={cameraVisible}
                closeCamera={handleCloseCamera}
                onPhotoTaken={handlePhotoTaken}
                capturedPhoto={capturedPhoto}
                codAval={codAval}
                codInd={codInd}
            /> 
        </View>
    )
}

export default Pergunta