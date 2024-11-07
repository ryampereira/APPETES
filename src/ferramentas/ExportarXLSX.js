// ExportarXLSX.js
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { fetchTablesData } from '../services/dbservice';

const ExportarXLSX = ({ modalVisible, setModalVisible }) => {
    const [loading, setLoading] = useState(false);

    const exportToExcel = async () => {
        setLoading(true);

        try {
            const tablesData = await fetchTablesData();
            const wb = XLSX.utils.book_new();

            Object.keys(tablesData).forEach(tableName => {
                const ws = XLSX.utils.json_to_sheet(tablesData[tableName]);
                XLSX.utils.book_append_sheet(wb, ws, tableName);
            });

            const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
            const uri = `${FileSystem.cacheDirectory}exported_data.xlsx`;

            await FileSystem.writeAsStringAsync(uri, wbout, {
                encoding: FileSystem.EncodingType.Base64,
            });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Erro ao exportar dados para XLSX:', error);
        }

        setLoading(false);
        setModalVisible(false);
    };

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Exportar como XLSX separado</Text>
                    <TouchableOpacity
                        style={styles.exportButton}
                        onPress={exportToExcel}
                        disabled={loading}
                    >
                        <Text style={styles.exportButtonText}>
                            {loading ? 'Exportando...' : 'Exportar'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

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
  

export default ExportarXLSX;
