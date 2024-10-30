import React from 'react';
import { Modal } from 'react-native-paper'; 
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { importDatabase } from '../services/dbservice';

const ImportModal = ({ modalVisible, setModalVisible }) => {
    const importFile = async () => {
        // Usa o DocumentPicker para selecionar o arquivo
        const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

        // Verifica se o usuário selecionou um arquivo
        if (result.type === 'success') {
            try {
                // Chama a função de importação com o URI do arquivo selecionado
                await importDatabase(result.uri);
                Alert.alert('Sucesso', 'Banco de dados importado com sucesso!'); // Mensagem de sucesso
            } catch (error) {
                Alert.alert('Erro', 'Erro ao importar o banco de dados: ' + error.message); // Mensagem de erro
            } finally {
                setModalVisible(false); // Fecha o modal após a importação
            }
        } else {
            Alert.alert('Erro', 'Nenhum arquivo selecionado.'); // Mensagem se nenhum arquivo for selecionado
        }
    };

    return (
        <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)} // Fecha o modal ao clicar fora dele
            contentContainerStyle={styles.modalContent}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Importar banco de dados</Text>
                <TouchableOpacity style={styles.button} onPress={importFile}>
                    <Text style={styles.buttonText}>Selecionar Arquivo</Text>
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
        flex: 1,
    },
    card: {
        width: '80%', // Largura do card
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5, // Sombra para o card
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#D3D3D3',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
    },
});

export default ImportModal;
