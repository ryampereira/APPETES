import React from 'react';
import { Modal } from 'react-native-paper'; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Sharing from 'expo-sharing';
import { exportDatabase } from '../services/dbservice'; // Importa apenas a função exportDatabase

const ExportModal = ({ modalVisible, setModalVisible, exportType }) => {
    const exportFile = async () => {
        try {
            const uri = await exportDatabase(); // Chama a função exportDatabase diretamente
            await Sharing.shareAsync(
                uri,
                { dialogTitle: 'Compartilhe ou copie seu arquivo via:' }
            );
        } catch (error) {
            alert('Erro ao exportar o banco de dados: ' + error.message);
        } finally {
            setModalVisible(false);
        }
    };

    return (
        <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)} // Fecha o modal ao clicar fora dele
            contentContainerStyle={styles.modalContent} // Ajuste o estilo do conteúdo
        >
            <View style={styles.container}>
                <Text style={styles.title}>{exportType} exportado com sucesso!</Text>
                <TouchableOpacity style={styles.button} onPress={exportFile}>
                    <Text style={styles.buttonText}>Compartilhar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3f81eb',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    buttonText: {
        color: '#FFFFFF',
    },
});

export default ExportModal;
