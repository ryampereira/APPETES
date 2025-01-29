import React, { useEffect, useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';  // Use apenas do 'victory-native'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { fetchHistory, fetchEteNameByCodETE } from '../services/dbservice';

const DashboardHistorico = ({ route, navigation }) => {
    const { codETE } = route.params;
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nomeETE, setNomeETE] = useState('');
    const [exporting, setExporting] = useState(false);

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

        const loadEteName = async () => {
            try {
                console.log('Buscando nome da ETE com CodETE:', codETE);
                const name = await fetchEteNameByCodETE(codETE);
                setNomeETE(name || 'Nome da ETE não encontrado');
                console.log("Nome da ETE:", name);
            } catch (error) {
                console.error('Erro ao carregar nome da ETE:', error);
            }
        };

        loadHistoricalScores();
        loadEteName();
    }, [codETE]);

    const handleExportPDF = async () => {
        setExporting(true);
        try {
            const htmlContent = `
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { text-align: center; color: #381704; }
                        h2 { color: #8B4513; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 10px; border: 1px solid #ddd; text-align: center; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>Histórico de Avaliações</h1>
                    <h2>ETE: ${nomeETE}</h2>
                    <table>
                        <tr>
                            <th>Data da Vistoria</th>
                            <th>Total de Pontos</th>
                        </tr>
                        ${historicalData.map(item => `
                            <tr>
                                <td>${item.dataVistoria}</td>
                                <td>${item.totalPoints}</td>
                            </tr>
                        `).join('')}
                    </table>
                </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            await Sharing.shareAsync(uri);
        } catch (error) {
            Alert.alert("Erro", "Erro ao exportar PDF.");
            console.error("Erro ao exportar PDF:", error);
        } finally {
            setExporting(false);
        }
    };

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
    
                    <VictoryLabel
                        x={320}  
                        y={250}  
                        text="Data"  
                        style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            fill: '#381704', 
                            textAnchor: 'middle'
                        }}
                    />
    
                    <VictoryLabel
                        x={50} 
                        y={10}  
                        text="Pontos"  
                        style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            fill: '#381704', 
                            textAnchor: 'middle'
                        }}
                    />
                </VictoryChart>
            </View>
    
            <TouchableOpacity
                style={[styles.exportButton, exporting && { backgroundColor: 'gray' }]}
                onPress={handleExportPDF}
                disabled={exporting}
            >
                {exporting ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Gerar PDF</Text>
                )}
            </TouchableOpacity>
    
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
        flexDirection: 'column',  
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
    exportButton: {
        backgroundColor: '#381704',
        padding: 6,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    backButton: {
        backgroundColor: '#381704',
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginTop: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default DashboardHistorico;
