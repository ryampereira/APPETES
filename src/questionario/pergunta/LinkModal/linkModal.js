import React, { useState } from "react";
import styles from "./style";

import { Entypo } from "@expo/vector-icons";
import { Modal, Portal } from "react-native-paper";
import { Alert, TextInput, TouchableOpacity, View, Text } from "react-native";
import { salvaLink } from "../../../services/questionarioservice";

const LinkModal = ({ codInd, codAval, setLink, modalVisible, setModalVisible }) => {
  const [url, setUrl] = useState("");

  const handleConfirm = async () => {
    try{
      await salvaLink(url, codInd, codAval)
      setLink(url);
    }
    catch (e){
      Alert.alert("Erro", "Erro ao salvar link.")
    }
    
    setModalVisible(!modalVisible);
  };

  return (
    <Portal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        onDismiss={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Entypo name="link" size={70} color="black" />
            <Text style={styles.modalTitle}>Insira o link do comprovante</Text>

            <TextInput style={styles.input}
              value={url}
              onChangeText={(url) => setUrl(url)}
              placeholder={"Entre com o Link do Google Drive"}
            />

            <View style={styles.modalButtonGroup}>
              <TouchableOpacity style={styles.modalButton} onPress={() => handleConfirm()}>
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default LinkModal;