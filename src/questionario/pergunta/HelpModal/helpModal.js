import React from "react";
import styles from "./style";

import { Feather } from "@expo/vector-icons";
import { Modal, Portal } from "react-native-paper";
import { View, Text, TouchableOpacity } from "react-native";

const HelpModal = ({ modalVisible, setModalVisible }) => {

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
            <Feather name="help-circle" size={70} color="black"/>
            <Text styl={styles.modalTitle}>Ajuda para salvar dados de comprovante</Text>

            <Text style={styles.modalText}>Para salvar o link do comprovante: </Text>
            <Text style={styles.modalText}>1. Clique no botão Link do Comprovante. </Text>
            <Text style={styles.modalText}>2. Procure o arquivo que desejar e copie seu link do Google Drive. </Text>
            <Text style={styles.modalText}>3. Volte para o APPETES e cole o link na caixa de texto que irá aparecer. </Text>
            <Text style={styles.modalText}>4. Clique no botão Confirmar. </Text>
            <Text style={styles.modalText}>5. Em caso de erro, exclua o link atual e refaça o processo acima. </Text>

            <TouchableOpacity style={styles.modalButton}
                background="#E13F33"
                onPress={() => setModalVisible(!modalVisible)}
              >
              <Text style={styles.modalButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default HelpModal;