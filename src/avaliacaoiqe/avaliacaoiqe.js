import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './styles'; // Supondo que seu arquivo de estilos esteja aqui
import { inclui, atualiza, exclui, buscaTodos } from '../services/dbservice';

const CadastroAvaliacaoIQE = ({ navigation, route }) => {
  const [avaliacao, setAvaliacao] = useState({
    AnoBase: '',
    DataVistoria: '',
    CodAvaliadorINEA: '',
    CodETE: '',
  });

  const [avaliadores, setAvaliadores] = useState([]);
  const [etes, setETEs] = useState([]);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);

  useEffect(() => {
    loadAvaliadores();
    loadETEs();

    if (route.params?.avId) {
      fetchAvaliacao();
    }
  }, [route.params?.avId]);

  async function loadAvaliadores() {
    try {
      const data = await buscaTodos('avaliadorinea');
      console.log('Dados dos avaliadores carregados:', data);
      // Corrigido para usar NomeAvaliador
      const validData = data.filter(avaliador => avaliador.CodAvaliadorINEA && avaliador.NomeAvaliador);
      console.log('Avaliadores válidos:', validData);
      setAvaliadores(validData);
    } catch (error) {
      console.error('Erro ao carregar avaliadores:', error);
      Alert.alert('Erro', 'Erro ao carregar avaliadores.');
    }
  }

  async function loadETEs() {
    try {
      const data = await buscaTodos('ete');
      console.log('ETEs carregados:', data);
      setETEs(data);
    } catch (error) {
      console.error('Erro ao carregar ETEs:', error);
      Alert.alert('Erro', 'Erro ao carregar ETEs.');
    }
  }

  async function fetchAvaliacao() {
    try {
      const data = await buscaTodos('avaliacaoiqe');
      const av = data.find(a => a.CodAval === route.params.avId);
      if (av) {
        setSelectedAvaliacao(av);
        setAvaliacao({
          AnoBase: av.AnoBase ? av.AnoBase.toString() : '',
          DataVistoria: av.DataVistoria || '',
          CodAvaliadorINEA: av.CodAvaliadorINEA ? av.CodAvaliadorINEA.toString() : '',
          CodETE: av.CodETE ? av.CodETE.toString() : '',
        });
      } else {
        Alert.alert('Atenção', 'Avaliação não encontrada.');
      }
    } catch (error) {
      console.error('Erro ao buscar Avaliação:', error);
      Alert.alert('Erro', 'Erro ao carregar os dados da Avaliação.');
    }
  }

  function validateFields() {
    const { AnoBase, DataVistoria, CodAvaliadorINEA, CodETE } = avaliacao;
    if (!AnoBase || isNaN(AnoBase) || !DataVistoria || !CodAvaliadorINEA || !CodETE) {
      return false;
    }
    return true;
  }

  async function handleSaveAvaliacao() {
    if (validateFields()) {
      try {
        if (selectedAvaliacao) {
          await atualiza('avaliacaoiqe', selectedAvaliacao.CodAval, avaliacao);
        } else {
          await inclui('avaliacaoiqe', avaliacao);
        }
        navigation.navigate('ListagemAvaliacaoIQE');
      } catch (error) {
        console.error('Erro ao salvar Avaliação:', error);
        Alert.alert('Erro', 'Erro ao salvar Avaliação.');
      }
    } else {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos corretamente.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cadastro de Avaliação de IQE</Text>

      <Text>Ano Base</Text>
      <TextInput
        style={styles.input}
        value={avaliacao.AnoBase}
        onChangeText={text => setAvaliacao(prev => ({ ...prev, AnoBase: text }))}
        keyboardType="numeric"
      />

      <Text>Data da Vistoria</Text>
      <TextInput
        style={styles.input}
        value={avaliacao.DataVistoria}
        onChangeText={text => setAvaliacao(prev => ({ ...prev, DataVistoria: text }))}
      />

      <Text>Avaliador</Text>
      <Picker
        selectedValue={avaliacao.CodAvaliadorINEA}
        style={styles.picker}
        onValueChange={(itemValue) => setAvaliacao(prev => ({ ...prev, CodAvaliadorINEA: itemValue }))}
      >
        {avaliadores.length > 0 ? (
          avaliadores.map(avaliador => (
            <Picker.Item key={avaliador.CodAvaliadorINEA} label={avaliador.NomeAvaliador} value={avaliador.CodAvaliadorINEA} />
          ))
        ) : (
          <Picker.Item label="Nenhum avaliador disponível" value="" />
        )}
      </Picker>

      <Text>ETE</Text>
      <Picker
        selectedValue={avaliacao.CodETE}
        style={styles.picker}
        onValueChange={(itemValue) => setAvaliacao(prev => ({ ...prev, CodETE: itemValue }))}
      >
        {etes.length > 0 ? (
          etes.map(ete => (
            <Picker.Item key={ete.CodETE} label={ete.NomeETE} value={ete.CodETE} />
          ))
        ) : (
          <Picker.Item label="Nenhuma ETE disponível" value="" />
        )}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSaveAvaliacao}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CadastroAvaliacaoIQE;




