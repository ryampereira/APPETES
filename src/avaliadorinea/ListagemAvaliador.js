import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { exclui, buscaTodos } from '../services/dbservice';

const ListagemAvaliadores = ({ navigation }) => {
  const [avaliadores, setAvaliadores] = useState([]);

  useEffect(() => {
    loadAvaliadores();
  }, []);

  async function loadAvaliadores() {
    try {
      const data = await buscaTodos('avaliadorinea');
      console.log('Dados retornados:', data);
      if (Array.isArray(data)) {
        setAvaliadores(data);
      } else {
        throw new Error('Dados retornados não são um array');
      }
    } catch (error) {
      console.error('Erro ao carregar avaliadores:', error);
      Alert.alert('Erro', 'Erro ao carregar avaliadores. Veja o console para mais detalhes.');
    }
  }

  function handleDeleteAvaliador(id) {
    Alert.alert(
      "Confirmar Exclusão",
      "Deseja realmente excluir este avaliador?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await exclui('avaliadorinea', id);
              loadAvaliadores();
            } catch (error) {
              console.error('Erro ao excluir o avaliador:', error);
              Alert.alert('Erro', 'Erro ao excluir o avaliador. Veja o console para mais detalhes.');
            }
          }
        }
      ]
    );
  }

  function handleEditAvaliador(id) {
    navigation.navigate('CadastroAvaliador', { avaliadorId: id });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Avaliadores cadastrados</Text>

      {avaliadores.length === 0 ? (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>Não há avaliadores cadastrados.</Text>
        </View>
      ) : (
        <FlatList
          data={avaliadores}
          keyExtractor={(item) => item.CodAvaliador.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item.NomeAvaliador}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditAvaliador(item.CodAvaliador)}
                >
                  <Text style={styles.buttonText}>Atualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteAvaliador(item.CodAvaliador)}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastroAvaliador')}>
        <Text style={styles.buttonText}>Incluir avaliador</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastrosBasicos')}>
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
    backgroundColor: '#F44336',
    height: 50,
    borderColor: '#fff',
    borderWidth: 2,
    width: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
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

export default ListagemAvaliadores;

