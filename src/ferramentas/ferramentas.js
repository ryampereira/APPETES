import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import ExportModal from './exportar'; 
import ImportModal from './importar';
import { Ionicons } from '@expo/vector-icons'; // Importa o Ionicons

const Ferramentas = ({ navigation }) => {
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
    });

    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [importModalVisible, setImportModalVisible] = useState(false);

    if (!fontsLoaded) {
        return null; 
    }

    return (
        <View style={styles.container}>
            {/* Seta para voltar para a HomeScreen */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()} // Navega de volta
            >
                <Ionicons name="arrow-back" size={24} color="#381704" />
            </TouchableOpacity>

            <Text style={styles.title}>Ferramentas</Text>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => setImportModalVisible(true)} // Abre o modal de importação
            >
                <Text style={styles.buttonText}>Importar banco de dados</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => setExportModalVisible(true)} // Abre o modal de exportação
            >
                <Text style={styles.buttonText}>Exportar banco de dados</Text> 
            </TouchableOpacity>

            {/* Modal de Importação */}
            <ImportModal 
                modalVisible={importModalVisible} 
                setModalVisible={setImportModalVisible} 
            />

            {/* Modal de Exportação */}
            <ExportModal 
                modalVisible={exportModalVisible} 
                setModalVisible={setExportModalVisible} 
                exportType="Dados"
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
        position: 'absolute', // Posiciona o botão no canto superior esquerdo
        top: 40, // Distância do topo
        left: 20, // Distância da esquerda
    },
});

export default Ferramentas;
