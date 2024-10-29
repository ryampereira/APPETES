import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { buscaTodos, exclui } from '../services/dbservice';

const ListagemETEs = ({ navigation }) => {
  const [etes, setETEs] = useState([]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      loadETEs();
    });
  }, []);

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

  async function handleDeleteETE(eteId) {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta ETE?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await exclui('ete', eteId);
              loadETEs();
            } catch (error) {
              console.error('Erro ao excluir ETE:', error);
              Alert.alert('Erro', 'Erro ao excluir ETE. Veja o console para mais detalhes.');
            }
          }
        }
      ]
    );
  }

  function handleEditETE(ete) {
    navigation.navigate('CadastroETE', { eteId: ete.CodETE });
  }

  function handleDashboardHistorico(codETE) {
    navigation.navigate('DashboardHistorico', { codETE });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ETEs cadastradas</Text>

      {etes.length === 0 ? (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>Não há ETEs cadastradas.</Text>
        </View>
      ) : (
        <FlatList
          data={etes}
          keyExtractor={(item) => item.CodETE.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text>{item.NomeETE}</Text>
                <Text>Endereço: {item.Endereco}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditETE(item)}>
                  <Text style={styles.buttonText}>Atualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteETE(item.CodETE)}>
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dashboardButton} onPress={() => handleDashboardHistorico(item.CodETE)}>
                  <Icon name="bar-chart" size={25} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastroETE')}>
        <Text style={styles.buttonText}>Cadastrar ETE</Text>
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
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    width: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    width: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Adiciona espaçamento igual
  },
  dashboardButton: {
    backgroundColor: '#FFA500', // Cor amarela
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    width: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Adiciona espaçamento igual
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

export default ListagemETEs;





