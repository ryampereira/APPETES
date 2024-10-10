import { useState } from "react";
import styles from "./style"

import {
    MaterialCommunityIcons,
    Feather,
    Ionicons,
    AntDesign,
} from "@expo/vector-icons";

import { View, TouchableOpacity, Text, Image } from "react-native";

import { atualizaResposta, salvaLink } from "../../services/questionarioservice";
import { Alert } from "react-native";

import * as Linking from "expo-linking";
import Camera from "../camera/camera";
import HelpModal from "./HelpModal/helpModal";
import LinkModal from "./LinkModal/linkModal";

const Pergunta = ({ titulo, foto, linkUrl, respostas, codAval, codInd, recarregaPerguntas }) => {

    const [cameraVisible, setCameraVisible] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(foto ? foto : null);

    const [link, setLink] = useState(linkUrl ? linkUrl : null);
    const [modalVisible, setModalVisible] = useState(false);
    const [helpModalVisible, setHelpModalVisible] = useState(false);

    // Abre google drive para pegar documento
    const pickDocument = async () => {
        try {
            Linking.openURL("http://drive.google.com");
            setModalVisible(true);
        } catch (e) {
            console.log(e)
            Alert.alert("Erro", "Erro ao abrir o Drive")
        }
    };

    // Abre modal de ajuda de uso para upload de link de comprovante
    const handleHelp = () => {
        setHelpModalVisible(!helpModalVisible)
    }

    // Exclui link de comprovante
    const handleLinkDelete = async () => {
        try{
          await salvaLink(null, codInd, codAval)
          setLink("")
        }
        catch (e){
          Alert.alert("Erro", "Erro ao excluir link!")
        }
      }
    
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

            <View style={styles.buttonContainer}>
                {!link ? (
                    <TouchableOpacity style={styles.buttonLink} onPress={() => pickDocument()}>
                        <Feather name="upload" size={24} color="white" />
                        <Text style={styles.linkText}>Link do Comprovante</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.buttonLink} uploaded={true} onPress={() => Linking.openURL(link)}>
                        <Ionicons name="document-outline" size={24} color="tomato" />
                        <Text style={styles.linkText} uploaded={true}>{link.slice(0, 20) + "..."}</Text>
                        <AntDesign
                            onPress={() => handleLinkDelete()}
                            name="close"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                )}

                <Feather name="help-circle" size={24} color="black" onPress={() => handleHelp()}/>
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

            <LinkModal
                codInd={codInd}
                codAval={codAval}
                setLink={setLink}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />

            <HelpModal
                modalVisible={helpModalVisible}
                setModalVisible={setHelpModalVisible}
            />
        </View>
    )
}

export default Pergunta