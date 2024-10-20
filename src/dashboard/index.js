import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { fetchScores } from '../services/dbservice';

const Dashboard = ({ route }) => {
    const { codAval } = route.params;
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('codAval recebido na DashboardScreen:', codAval);

        const getScores = async () => {
            try {
                const scoresData = await fetchScores(codAval);
                console.log('Pontuações obtidas:', scoresData);

                // formato esperado pelo VictoryBar
                const formattedScores = scoresData.map((item, index) => ({
                    x: item.CodInd,
                    y: item.CodAvalPeso !== null ? item.CodAvalPeso : 0
                }));

                setScores(formattedScores);
            } catch (error) {
                console.error('Erro ao buscar pontuações:', error);
            } finally {
                setLoading(false);
            }
        };

        getScores();
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
            <Text style={styles.title}>Pontuações da Avaliação {codAval}</Text>
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={20}
            >
                <VictoryAxis
                    label="Perguntas"
                    style={{
                        axisLabel: { padding: 30 },
                        tickLabels: { angle: -45, fontSize: 10, padding: 5 }
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    label="Pontuação"
                    style={{
                        axisLabel: { padding: 35 }
                    }}
                />
                <VictoryBar
                    data={scores}
                    x="x"
                    y="y"
                    style={{ data: { fill: '#4CAF50' } }}
                />
            </VictoryChart>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Dashboard;
