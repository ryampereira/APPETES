import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { fetchScores, fetchEteNameByCodAval, fetchDataVistoriabyCodAval } from '../services/dbservice';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const Dashboard = ({ navigation, route }) => {
    const { codAval } = route.params;
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eteName, setEteName] = useState('');
    const [dataVistoria, setDataVistoria] = useState('');
    const [exporting, setExporting] = useState(false);

    const perguntas = [
        "Proximidade de Núcleos Habitacionais",
        "Zoneamento Municipal",
        "Status operacional das unidades que compõem o sistema",
        "Estado de conservação da infraestrutura civil",
        "Estado de manutenção das máquinas e equipamentos operacionais",
        "Cor do efluente tratado (Ausência de cor - Translúcido)",
        "Materiais sedimentáveis no efluente tratado (Até 1ml/l em teste de 1 hora em 'Cone Imhoff')",
        "Materiais flutuantes no efluente tratado (Ausente)",
        "Odor característico (Perceptível fora dos limites do ETE)",
        "Vinculação ao Programa de Auto Controle de Efluentes Líquidos (PROCON ÁGUA - DZ 942. R7)",
        "Atendimento à frequência de monitoramento estabelecida pelo órgão ambiental competente",
        "Atendimento aos parâmetros estabelecidos",
        "Número de violações aos padrões de lançamento vigentes nos últimos 3 meses",
        "Armazenamento de produtos químicos necessários à operação da ETE",
        "Possui medidor de vazão acessível à fiscalização (Entrada e Saída)",
        "Possui unidade de tratamento prévio de lodo em operação",
        "Possui contrato com empresa licenciada para destinação do lodo",
        "Possui contrato com empresa licenciada para destinação dos resíduos sólidos",
        "Possui certificado de ART do operador da ETE",
        "Possui outorga de lançamento de efluente tratado",
        "Operação de acordo com o manual aprovado pelo órgão ambiental competente",
        "Plano de inspeção e manutenção",
        "Plano de contingência",
        "Possui sistema de reaproveitamento de Biogás",
        "Possui sistema de desinfecção (Polimento)",
        "Faz reuso do efluente tratado",
        "Credenciamento do laboratório que realiza as análises do efluente",
        "Elaborou inventário de emissões de gases de efeito estufa no exercício do ano anterior"
    ];

    useEffect(() => {
        const getScoresAndEteName = async () => {
            try {
                const scoresData = await fetchScores(codAval);
                const nomeETE = await fetchEteNameByCodAval(codAval);
                setEteName(nomeETE || 'ETE não encontrada');
                const dataVistoria = await fetchDataVistoriabyCodAval(codAval);
                setDataVistoria(dataVistoria || 'Ano vistoria não encontrada');

                const formattedScores = scoresData.map((item) => ({
                    x: item.CodInd,
                    y: item.Porcentagem,
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

    const handleExportPDF = async () => {
        setExporting(true);
        try {
            const html = `
                <html>
                    <head>
                        <style>
                            h1 { text-align: center; font-size: 24px; color: #333; }
                            h2 { font-size: 18px; color: #333; margin-top: 20px; }
                            p, ul { font-size: 12px; color: #555; }
                            ul { padding: 0; list-style: none; }
                            li { margin-bottom: 5px; }
                        </style>
                    </head>
                    <body>
                        <h1>Dashboard da ${eteName}</h1>
                        <p>Data da Vistoria: ${dataVistoria}</p>
                        <h2>Legenda das Perguntas:</h2>
                        <ul>
                            ${perguntas.map((pergunta, index) => `<li>${index + 1}: ${pergunta}</li>`).join('')}
                        </ul>
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert("Exportação Completa", "PDF foi salvo em: " + uri);
            }
        } catch (error) {
            console.error('Erro ao exportar para PDF:', error);
            Alert.alert('Erro', 'Não foi possível exportar o PDF. Verifique se há um leitor de PDF instalado.');
        } finally {
            setExporting(false);
        }
    };

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
            <Text style={styles.title}>Dashboard da {eteName} em {dataVistoria}</Text>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                    label="Perguntas"
                    tickValues={Array.from({ length: perguntas.length }, (_, i) => i + 1)}
                    style={{
                        axisLabel: { padding: 30 },
                        tickLabels: { angle: -45, fontSize: 8, padding: 3 },
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    label="Porcentagem (%)"
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

            <ScrollView style={styles.scrollView}>
                {perguntas.map((pergunta, index) => (
                    <Text key={index} style={styles.questionText}>
                        {index + 1}: {pergunta}
                    </Text>
                ))}
            </ScrollView>

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
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    scrollView: {
        marginTop: 5,
        marginBottom: 20,
    },
    questionText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    exportButton: {
        backgroundColor: '#381704', 
        padding: 5, 
        borderRadius: 5, 
        alignItems: 'center', 
        marginVertical: 5, 
    },
    backButton: {
        backgroundColor: '#381704', 
        padding: 5, 
        borderRadius: 5, 
        alignItems: 'center',
        marginVertical: 5, 
    },
    
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff', // Cor do texto
        fontWeight: 'bold', // Texto em negrito
        fontSize: 16, // Tamanho da fonte
    },
});

export default Dashboard;
