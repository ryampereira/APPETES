import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Dashboard = ({ navigation, route }) => {
    const codAval = route.params.codAval;
    const codETE = route.params.codETE;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Dashboard</Text>
            <Text style={styles.text}>Código da Avaliação: {codAval}</Text>
            <Text style={styles.text}>Código da ETE: {codETE}</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8', // Cor de fundo suave
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#381704',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    backButton: {
        marginTop: 20,
        backgroundColor: '#381704', // Cor do botão
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Dashboard;
