import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import ExportModal from './exportar'; 

const Ferramentas = ({ navigation }) => {
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
    });

    const [modalVisible, setModalVisible] = useState(false);

    if (!fontsLoaded) {
        return null; 
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ferramentas</Text>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('ImportModal')}
            >
                <Text style={styles.buttonText}>Importar banco de dados</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => setModalVisible(true)} // Abre o modal de exportação
            >
                <Text style={styles.buttonText}>Exportar banco de dados</Text> 
            </TouchableOpacity>

            {/* Aqui o modal é controlado diretamente */}
            <ExportModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible} 
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
});

export default Ferramentas;

