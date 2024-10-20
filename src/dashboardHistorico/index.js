import React, { useEffect, useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import { View, Text, StyleSheet } from 'react-native';
import { fetchHistory } from '../services/dbservice';

const DashboardHistorico = () => {
    const [pointsByETE, setPointsByETE] = useState([]);

    useEffect(() => {
        const loadPointsByETE = async () => {
            try {
                const data = await fetchHistory();
                setPointsByETE(data);
                console.log("Pontuações por ETE:", data);
            } catch (error) {
                console.error('Erro ao carregar pontuações por ETE:', error);
            }
        };

        loadPointsByETE();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pontuação por ETE</Text>
            <VictoryChart
                padding={{ top: 20, bottom: 60, left: 50, right: 20 }}
                domainPadding={{ x: [20, 20], y: [0, 0] }}
            >
                <VictoryAxis
                    tickFormat={pointsByETE.map(item => item.nomeETE)}
                    style={{
                        tickLabels: { fontSize: 10, angle: 45, textAnchor: 'start' }
                    }}
                />
                <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
                <VictoryBar
                    data={pointsByETE}
                    x="nomeETE"
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
});

export default DashboardHistorico;