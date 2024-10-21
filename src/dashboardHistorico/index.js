import React, { useEffect, useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchHistory } from '../services/dbservice';

const DashboardHistorico = ({ route }) => {
    const { codETE } = route.params;
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistoricalScores = async () => {
            try {
                const data = await fetchHistory(codETE);
                setHistoricalData(data);
                console.log("Dados históricos:", data);
            } catch (error) {
                console.error('Erro ao carregar histórico de pontuações:', error);
            } finally {
                setLoading(false);
            }
        };

        loadHistoricalScores();
    }, [codETE]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando histórico...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Histórico de Avaliações</Text>
            <VictoryChart
                padding={{ top: 20, bottom: 60, left: 50, right: 20 }}
                domainPadding={{ x: [50, 50], y: [0, 0] }}
            >
                <VictoryAxis
                    tickFormat={historicalData.map(item => item.dataVistoria)}
                    style={{
                        tickLabels: { fontSize: 10, angle: 45, textAnchor: 'start' }
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => `${x}`}
                />
                <VictoryBar
                    data={historicalData}
                    x="dataVistoria"
                    y="totalPoints"
                    barWidth={20}
                    style={{ data: { fill: "#4caf50" } }}
                />
            </VictoryChart>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DashboardHistorico;
