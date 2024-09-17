import { buscaPergunta } from "../services/dbservice"
import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles  from "./style.js";

import { criaPerguntaEmAvaliacaoItem, mostrarAvaliacaoItem } from "../services/dbservice";

const Questionario = () => {
    const navigate = useNavigation();
    const [perguntas, setPerguntas] = useState([])

    const formataPerguntas = (dados) => {
        const perguntas = [];

        dados.forEach(item => {
            // Verifica se o título já foi adicionado à lista de perguntas
            let pergunta = perguntas.find(p => p.titulo === item.DescrInd);
          
            if (!pergunta) {
              // Se não estiver na lista, cria uma nova pergunta
              pergunta = {
                id: item.CodInd,
                titulo: item.DescrInd,
                respostas: []
              };
              perguntas.push(pergunta);
            }
          
            // Adiciona a resposta à pergunta correspondente
            pergunta.respostas.push({
              texto: item.DescrResAval,
              pontuacao: item.Pontuacao
            });
          });
          
        return perguntas
    }

    const fetchData = async () => {
        const response = await buscaPergunta();

        const perguntasFormatadas = formataPerguntas(response);

        try {
            for (pergunta in perguntasFormatadas) {
                await criaPerguntaEmAvaliacaoItem(pergunta.id)
            }
        }
        catch (err){
            console.log(err)
        }

        await mostrarAvaliacaoItem();

        setPerguntas(perguntasFormatadas)

        // console.log(perguntasFormatadas)
    }

    useEffect(() => {
        fetchData();
    }, [])

    return(
        <View style={styles.container}>
            <TouchableOpacity style={{padding: 50}} onPress={() => navigate.goBack()}>
                <Text>Voltar</Text>
            </TouchableOpacity>


            <View style={{backgroundColor: 'yellow', flex: 1}}>
                {
                    perguntas.map((cadaPergunta, index) => {
                        return (
                            <View style={{backgroundColor: "red", margin: 10}}>
                                <Text key={index} style={{color: "#000", backgroundColor: 'green'}}>{cadaPergunta.id}{cadaPergunta.titulo}</Text>

                                {
                                    cadaPergunta.respostas.map((cadaResposta, index) => {
                                        return <Text key={index} style={{color: "#000", backgroundColor: 'green'}}>{cadaResposta.texto}</Text>
                                    })
                                }
                            </View>
                        )
                    })
                }
            </View>


        </View>

    )
}

export default Questionario;