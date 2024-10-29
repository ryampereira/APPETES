// Dashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { fetchScores, fetchEteNameByCodAval, fetchDataVistoriabyCodAval } from '../services/dbservice';


const Dashboard = ({ navigation, route }) => {
    const { codAval } = route.params;
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eteName, setEteName] = useState('');
    const [dataVistoria, setDataVistoria] = useState('');

    // Perguntas para a legenda
    const perguntas = [
        "Proximidade de Núcleos Habitacionais",
        "Zoneamento Municipal",
        "Status operacional das unidades que compõem o sistema",
        "Estado de conservação da infra-estrutura civil (Gradeamento, caixa de areia, decantadores primários, secundário, lagoas e etc.)",
        "Estado de manutenção das máquinas e equipamentos operacionais",
        "Cor do efluente tratado (Ausência de cor - Translúcido)",
        "Materiais sedimentáveis no efluente tratado (Até 1ml/l em teste de 1 hora em 'Cone Imhoff')",
        "Materiais flutuantes no efluente tratado (Ausente)",
        "Odor característico (Perceptível fora dos limites do ETE)",
        "Vinculação ao Programa de Auto Controle de Efluentes Líquidos (PROCON ÁGUA - DZ 942. R7)",
        "Atendimento à frequência de monitoramento estabelecida pelo órgão ambiental competente",
        "Atendimento aos parâmetros estabelecidos (Informação obtida da análise dos três últimos R.A.Es. ou boletins de análise realizado por laboratório credenciado)",
        "Número de violações aos padrões de lançamento vigentes nos últimos 3 meses",
        "Armazenamento de produtos químicos necessários à operação da ETE",
        "Possui medidor de vazão acessível à fiscalização (Entrada e Saída)",
        "Possui unidade de tratamento prévio de lodo em operação (Secagem e Desidratação)",
        "Possui contrato com empresa licenciada para a coleta, transporte, tratamento e destinação final do lodo gerado nos tratamentos primário e secundário",
        "Possui contrato com empresa licenciada para a coleta, transporte, tratamento e destinação final dos resíduos sólidos removidos no tratamento preliminar",
        "Possui certificado de ART do operador da ETE",
        "Possui outorga de lançamento de efluente tratado (Atendimento à Resolução CNRH Nº 65)",
        "Operação de acordo com o manual apresentado e aprovado pelo órgão ambiental competente",
        "Plano de inspeção e manutenção",
        "Plano de contingência",
        "Possui sistema de reaproveitamento de Biogás",
        "Possui sistema de desinfecção (Polimento)",
        "Faz reuso do efluente tratado",
        "Credenciamento do laboratório que realiza as análises do efluente",
        "Elaborou inventário de emissões de gases de efeito estufa no exercício do ano anterior (Atendimento à Resolução INEA Nº 64/12)"
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
                    style={{
                        axisLabel: { padding: 30 },
                        tickLabels: { angle: -45, fontSize: 10, padding: 5 },
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

            {/* ScrollView para a lista de perguntas */}
            <ScrollView style={[styles.scrollView, { marginBottom: 80 }]}>
                {perguntas.map((pergunta, index) => (
                    <Text key={index} style={styles.questionText}>
                        {index + 1}: {pergunta}
                    </Text>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: 60,
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
        marginTop: 55,
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
    scrollView: {
        width: '100%',
        marginTop: 10, // Espaço acima da ScrollView
    },
    questionText: {
        color: '#8B4513', // Cor amarronzada
        fontSize: 14, // Tamanho da fonte
        marginVertical: 5, // Espaço vertical entre as perguntas
        textAlign: 'left', // Alinhamento à esquerda
    },
});

export default Dashboard;








