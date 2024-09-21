import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { buscaTodos, exclui } from '../services/dbservice';

const ListagemAvaliacaoIQE = ({ navigation }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [avaliadores, setAvaliadores] = useState([]);
  const [etes, setETEs] = useState([]);

  useEffect(() => {
    loadAvaliacoes();
    loadAvaliadores();
    loadETEs();
  }, []);

  async function loadAvaliacoes() {
    try {
      const data = await buscaTodos('avaliacaoiqe');
      if (Array.isArray(data)) {
        setAvaliacoes(data);
      } else {
        throw new Error('Dados retornados não são um array');
      }
    } catch (error) {
      console.error('Erro ao carregar Avaliações:', error);
      Alert.alert('Erro', 'Erro ao carregar Avaliações. Veja o console para mais detalhes.');
    }
  }

  async function loadAvaliadores() {
    try {
      const data = await buscaTodos('avaliadorinea');
      if (Array.isArray(data)) {
        setAvaliadores(data);
      } else {
        throw new Error('Dados retornados não são um array');
      }
    } catch (error) {
      console.error('Erro ao carregar Avaliadores:', error);
      Alert.alert('Erro', 'Erro ao carregar Avaliadores. Veja o console para mais detalhes.');
    }
  }

  async function loadETEs() {
    try {
      const data = await buscaTodos('ete');
      if (Array.isArray(data)) {
        setETEs(data);
      } else {
        throw new Error('Dados retornados não são um array');
      }
    } catch (error) {
      console.error('Erro ao carregar ETEs:', error);
      Alert.alert('Erro', 'Erro ao carregar ETEs. Veja o console para mais detalhes.');
    }
  }

  async function handleDeleteAvaliacao(avId) {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta Avaliação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await exclui('avaliacaoiqe', avId); // Chama a função de exclusão
              loadAvaliacoes(); // Atualiza a lista após a exclusão
            } catch (error) {
              console.error('Erro ao excluir Avaliação:', error);
              Alert.alert('Erro', 'Erro ao excluir Avaliação. Veja o console para mais detalhes.');
            }
          }
        }
      ]
    );
  }

  function handleEditAvaliacao(avaliacao) {
    navigation.navigate('CadastroAvaliacaoIQE', { avId: avaliacao.CodAval });
  }

  // Função para obter o nome do avaliador com base no código
  function getAvaliadorNome(codAvaliadorINEA) {
    const avaliador = avaliadores.find(av => av.CodAvaliador === codAvaliadorINEA);
    return avaliador ? avaliador.NomeAvaliador : 'N/A';
  }

  // Função para obter o nome da ETE com base no código
  function getETENome(codETE) {
    const ete = etes.find(e => e.CodETE === codETE);
    return ete ? ete.NomeETE : 'N/A';
  }

  function goToQuestionario (codAval) {
    navigation.navigate('Questionario', { codAval: codAval })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Avaliações de IQE cadastradas</Text>

      {avaliacoes.length === 0 ? (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>Não há Avaliações cadastradas.</Text>
        </View>
      ) : (
        <FlatList
          data={avaliacoes}
          keyExtractor={(item) => item.CodAval ? item.CodAval.toString() : '0'}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => goToQuestionario(item.CodAval)} style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text>{item.AnoBase ? item.AnoBase.toString() : 'N/A'} - {item.DataVistoria ? item.DataVistoria.toString() : 'N/A'}</Text>
                <Text>Avaliador: {getAvaliadorNome(item.CodAvaliadorINEA)}</Text>
                <Text>ETE: {getETENome(item.CodETE)}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditAvaliacao(item)}>
                  <Text style={styles.buttonText}>Atualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAvaliacao(item.CodAval)}>
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastroAvaliacaoIQE')}>
        <Text style={styles.buttonText}>Cadastrar Avaliação</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 80,
    color: '#381704',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderColor: '#fff',
    borderWidth: 2,
    width: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    height: 50,
    borderColor: '#fff',
    borderWidth: 2,
    width: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#381704',
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});

export default ListagemAvaliacaoIQE;
