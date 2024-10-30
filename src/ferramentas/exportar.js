import React from 'react';
import { Modal } from 'react-native-paper'; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Sharing from 'expo-sharing';
import { exportDatabase } from '../services/dbservice'; // Importa a função exportDatabase

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
            contentContainerStyle={styles.modalContent} // Estilo do conteúdo
        >
            <View style={styles.card}>
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
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1, // Faz o modal ocupar toda a tela
    },
    card: {
        width: '80%', // Largura do card
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5, // Sombra para o card
        alignItems: 'center', // Centraliza o conteúdo
    },
    title: {
        fontSize: 18, // Tamanho da fonte ajustado
        marginBottom: 15, // Ajuste no espaçamento inferior
        textAlign: 'center', // Centraliza o texto do título
    },
    button: {
        backgroundColor: '#D3D3D3', // Cor cinza claro
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%', // Largura total do botão
        alignItems: 'center', // Centraliza o texto do botão
    },
    buttonText: {
        color: '#000000', // Texto preto
    },
});

export default ExportModal;


