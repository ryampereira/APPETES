import React, { useEffect, useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchHistory, fetchEteNameByCodETE } from '../services/dbservice';

const DashboardHistorico = ({ route, navigation }) => {
    const { codETE } = route.params;
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nomeETE, setNomeETE] = useState('');

    useEffect(() => {
        const loadHistoricalScores = async () => {
            try {
                const data = await fetchHistory(codETE);
                setHistoricalData(data);
                console.log("Dados históricos:", data);
            } catch (error) {
                console.error('Erro ao carregar histórico de pontuações:', error);
            } finally {
                setLoading(false); // Mover para o bloco finally
            }
        };

        const loadEteName = async () => {
            try {
                console.log('Buscando nome da ETE com CodETE:', codETE); // Adicione esta linha
                const name = await fetchEteNameByCodETE(codETE);
                setNomeETE(name || 'Nome da ETE não encontrado');
                console.log("Nome da ETE:", name); // Adicione esta linha
            } catch (error) {
                console.error('Erro ao carregar nome da ETE:', error);
            }
        };

        loadHistoricalScores();
        loadEteName();
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
            <View style={styles.chartContainer}>
                <Text style={styles.title}>Histórico de avaliações</Text>
                <Text style={styles.eteName}>ETE: {nomeETE}</Text>
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
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
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
    chartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    eteName: {
        fontSize: 20,
        fontWeight: '600', 
        color: '#381704', 
        textAlign: 'center', 
        marginBottom: 20,  
        borderBottomColor: '#8B4513', 
        paddingBottom: 10, 
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
    backButtonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default DashboardHistorico;

