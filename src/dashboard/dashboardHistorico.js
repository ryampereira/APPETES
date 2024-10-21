import { View, Text } from 'react-native'
import { useEffect, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { VictoryChart, VictoryBar } from 'victory-native';

import {
    pegaPontuacaoUsuario,
    pegaPontuacaoTotal,
    pegaDataVistoria
  } from '../services/questionarioservice';


const DashboardHistorico = ({route}) => {
    const navigate = useNavigation();
    // const [data, setData] = useState([]);
    const codAval = route.params.codAval;

    // const fetchData = async () => {
    //     try {
    //       const pontuacaoTotal = await pegaPontuacaoTotal();
    //       const formattedData = [];
    //       const codAvals = [codAval]; // Adicione outros `codAval` conforme necessário.
      
    //       for (let cod of codAvals) {
    //         const pontuacaoUsuario = await pegaPontuacaoUsuario(cod);
    //         const dataVistoria = await pegaDataVistoria(cod);
    //         const percent = (pontuacaoUsuario / pontuacaoTotal) * 100;
      
    //         // Converta a data de vistoria para um formato Date caso necessário.
    //         const date = new Date(dataVistoria);
      
    //         formattedData.push({ x: date, y: percent });
    //       }
      
    //       setData(formattedData);
    //     } catch (error) {
    //       console.error('Erro ao buscar dados para o gráfico:', error);
    //     }
    //   };
      
    // useEffect(() => {
    //     fetchData();
    // }, []);

    const data = [
      { x: new Date('2023-01-01'), y: 75 },
      { x: new Date('2023-02-01'), y: 80 },
      { x: new Date('2023-03-01'), y: 60 }
    ];
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Histórico de Pontuações</Text>
            <VictoryChart domainPadding={20}>
            <VictoryBar
            animate={false}
              data={[
                { x: "Jan", y: 30 },
                { x: "Feb", y: 50 },
                { x: "Mar", y: 40 }
              ]}
            />
          </VictoryChart>
        </View>
    )
}

export default DashboardHistorico;