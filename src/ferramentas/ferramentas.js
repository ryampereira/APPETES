import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import ExportModal from './exportar';
import ImportModal from './importar';
import ExportarXLSX from './ExportarXLSX';
import ExportarXLSXUnificadoModal from './ExportarXLSXu';  // Importa o novo modal de exportação unificada
import { Ionicons } from '@expo/vector-icons';

const Ferramentas = ({ navigation }) => {
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
    });

    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [exportXLSXVisible, setExportXLSXVisible] = useState(false);
    const [exportXLSXUnificadoVisible, setExportXLSXUnificadoVisible] = useState(false);  // Novo estado para o modal de exportação unificada

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#381704" />
            </TouchableOpacity>

            <Text style={styles.title}>Ferramentas</Text>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => setImportModalVisible(true)}
            >
                <Text style={styles.buttonText}>Importar banco de dados</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => setExportModalVisible(true)}
            >
                <Text style={styles.buttonText}>Exportar banco de dados</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => setExportXLSXVisible(true)}
            >
                <Text style={styles.buttonText}>Exportar como XLSX</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => setExportXLSXUnificadoVisible(true)}  // Novo botão para abrir o modal de exportação unificada
            >
                <Text style={styles.buttonText}>Exportar como XLSX Unificado</Text>
            </TouchableOpacity>

            <ImportModal 
                modalVisible={importModalVisible} 
                setModalVisible={setImportModalVisible} 
            />

            <ExportModal 
                modalVisible={exportModalVisible} 
                setModalVisible={setExportModalVisible} 
                exportType="Dados"
            />

            <ExportarXLSX 
                modalVisible={exportXLSXVisible} 
                setModalVisible={setExportXLSXVisible} 
            />

            <ExportarXLSXUnificadoModal   // Novo modal de exportação unificada
                modalVisible={exportXLSXUnificadoVisible} 
                setModalVisible={setExportXLSXUnificadoVisible} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F5F5F5', 
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 20, 
        color: '#381704', 
        textAlign: 'center',
        fontFamily: 'Roboto_700Bold',
    },
    button: {
        backgroundColor: '#381704', 
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginVertical: 10, 
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Roboto_400Regular',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
});

export default Ferramentas;
