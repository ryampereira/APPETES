import React, { useState } from 'react';
import { Modal, View, Text, Button, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { exportToXLSXUnified } from '../services/dbservice';
import * as Sharing from 'expo-sharing'; // Importando o módulo de compartilhamento

export default function ExportarXLSXUnificadoModal({ modalVisible, setModalVisible }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Chama a função de exportação e recebe o caminho do arquivo gerado
      const filePath = await exportToXLSXUnified();

      // Compartilhando o arquivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
        Alert.alert('Sucesso', `Arquivo exportado e compartilhado com sucesso!`);
      } else {
        Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar o arquivo.');
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Exportar como arquivo XLSX unificado?</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
                <Text style={styles.exportButtonText}>Exportar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%', // Largura do card
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      elevation: 5, // Sombra para o card
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 15,
      textAlign: 'center',
    },
    exportButton: {
      backgroundColor: '#D3D3D3', // Cor do botão
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
      width: '100%',
      alignItems: 'center',
    },
    exportButtonText: {
      color: '#000000', // Cor do texto do botão
    },
    closeButton: {
      marginTop: 10,
    },
    closeButtonText: {
      color: '#381704', // Cor do texto do botão de fechar
      fontSize: 16,
    },
  });
  
