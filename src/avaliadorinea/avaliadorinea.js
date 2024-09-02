import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from './styles'; // Importando o estilo
import { inclui, atualiza, buscaTodos } from '../services/dbservice';

const CadastroAvaliador = ({ route, navigation }) => {
  const [nome, setNome] = useState('');
  const [avaliadorId, setAvaliadorId] = useState(null);

  useEffect(() => {
    if (route.params && route.params.avaliadorId) {
      setAvaliadorId(route.params.avaliadorId);
      fetchAvaliador(route.params.avaliadorId);
    }
  }, [route.params]);

  async function fetchAvaliador(id) {
    try {
      const data = await buscaTodos('avaliadorinea');
      const avaliador = data.find(a => a.CodAvaliador === id);
      if (avaliador) {
        setNome(avaliador.NomeAvaliador);
      } else {
        Alert.alert('Erro', 'Avaliador não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar avaliador:', error);
      Alert.alert('Erro', 'Erro ao buscar avaliador. Veja o console para mais detalhes.');
    }
  }

  async function handleSaveAvaliador() {
    const data = { NomeAvaliador: nome };

    if (nome) {
      try {
        if (avaliadorId) {
          await atualiza('avaliadorinea', avaliadorId, data);
          Alert.alert('Sucesso', 'Avaliador atualizado com sucesso.');
        } else {
          await inclui('avaliadorinea', data);
          Alert.alert('Sucesso', 'Avaliador cadastrado com sucesso.');
        }
        resetForm();
        navigation.navigate('ListagemAvaliadores');
      } catch (error) {
        console.error('Erro ao salvar o avaliador:', error);
        Alert.alert('Erro ao salvar o avaliador', 'Veja o console para mais detalhes.');
      }
    } else {
      Alert.alert('Aviso', 'O nome do avaliador é obrigatório.');
    }
  }

  function resetForm() {
    setNome('');
    setAvaliadorId(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cadastro de Avaliador</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Avaliador</Text>
        <TextInput
          placeholder="Digite o nome do avaliador"
          onChangeText={setNome}
          value={nome}
          style={styles.textInput}
        />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListagemAvaliadores')}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSaveAvaliador}>
          <Text style={styles.buttonText}>{avaliadorId ? 'Atualizar' : 'Incluir'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CadastroAvaliador;
