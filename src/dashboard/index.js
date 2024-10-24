import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { fetchScores, fetchEteNameByCodAval, fetchDataVistoriabyCodAval } from '../services/dbservice'; // Importando a função

const Dashboard = ({ navigation, route }) => {
    const { codAval } = route.params;
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eteName, setEteName] = useState(''); 
    const [DataVistoria, setDataVistoria] = useState('')

    useEffect(() => {
        console.log('codAval recebido na DashboardScreen:', codAval);

        const getScoresAndEteName = async () => {
            try {
                const scoresData = await fetchScores(codAval);
                console.log('Pontuações obtidas:', scoresData);

                // Busca o nome da ETE
                const nomeETE = await fetchEteNameByCodAval(codAval);
                setEteName(nomeETE || 'ETE não encontrada'); // Se não encontrar, mostrar mensagem padrão

                const DataVistoria = await fetchDataVistoriabyCodAval(codAval);
                setDataVistoria(DataVistoria || 'Ano vistoria não encontrada');

                // Formatação dos dados esperada pelo VictoryBar
                const formattedScores = scoresData.map((item) => ({
                    x: item.CodInd,
                    y: item.CodAvalPeso !== null ? item.CodAvalPeso : 0,
                }));

                setScores(formattedScores);
            } catch (error) {
                console.error('Erro ao buscar pontuações ou nome da ETE:', error);
            } finally {
                setLoading(false);
            }
        };

        getScoresAndEteName();
    }, [codAval]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando pontuações...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard da {eteName} em {DataVistoria}</Text>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                    label="Perguntas"
                    style={{
                        axisLabel: { padding: 30 },
                        tickLabels: { angle: -45, fontSize: 10, padding: 5 },
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    label="Pontuação"
                    style={{
                        axisLabel: { padding: 35 },
                    }}
                />
                <VictoryBar
                    data={scores}
                    x="x"
                    y="y"
                    style={{ data: { fill: '#4CAF50' } }}
                />
            </VictoryChart>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#381704',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        width: '100%',
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Dashboard;




