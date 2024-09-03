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
    loadAvaliadores();  // Carregar avaliadores
    loadETEs();         // Carregar ETEs

    if (route.params?.avId) {
      fetchAvaliacao();
    }
  }, [route.params?.avId]);

  async function loadAvaliadores() {
    try {
      const data = await buscaTodos('avaliadorinea');
      if (data && data.length > 0) {
        setAvaliadores(data);
      } else {
        setAvaliadores([]);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliadores:', error);
      Alert.alert('Erro', 'Erro ao carregar avaliadores.');
    }
  }

  async function loadETEs() {
    try {
      const data = await buscaTodos('ete');
      if (data && data.length > 0) {
        setETEs(data);
      } else {
        setETEs([]);
      }
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
    return AnoBase && isNumeric(AnoBase) && DataVistoria && isValidDate(DataVistoria) && CodAvaliadorINEA && CodETE;
  }

  function isNumeric(value) {
    return /^\d+$/.test(value);
  }

  function isValidDate(dateString) {
    // Regex para verificar o formato dia/mês/ano
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(dateString);
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ano Base</Text>
        <TextInput
          style={styles.textInput}
          value={avaliacao.AnoBase}
          onChangeText={text => setAvaliacao(prev => ({ ...prev, AnoBase: text }))}
          keyboardType="numeric"
          placeholder="Digite o ano base"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data da Vistoria (dd/mm/aaaa)</Text>
        <TextInput
          style={styles.textInput}
          value={avaliacao.DataVistoria}
          onChangeText={text => setAvaliacao(prev => ({ ...prev, DataVistoria: text }))}
          placeholder="Digite a data da vistoria"
          maxLength={10} // Para limitar o comprimento ao formato dd/mm/aaaa
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Avaliador</Text>
        <Picker
          selectedValue={avaliacao.CodAvaliadorINEA}
          style={styles.textInput}
          onValueChange={(itemValue) => setAvaliacao(prev => ({ ...prev, CodAvaliadorINEA: itemValue }))}
        >
          {avaliadores.length > 0 ? (
            avaliadores.map(avaliador => (
              <Picker.Item key={avaliador.CodAvaliador} label={avaliador.NomeAvaliador} value={avaliador.CodAvaliador} />
            ))
          ) : (
            <Picker.Item label="Nenhum avaliador disponível" value="" />
          )}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ETE</Text>
        <Picker
          selectedValue={avaliacao.CodETE}
          style={styles.textInput}
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
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSaveAvaliacao}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CadastroAvaliacaoIQE;








