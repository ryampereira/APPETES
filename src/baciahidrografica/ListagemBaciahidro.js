import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { exclui, buscaTodos } from '../services/dbservice';

const ListagemBaciahidro = ({ navigation }) => {
  const [bacias, setBacias] = useState([]);

  useEffect(() => {
    // Evita renderizar dados antigos quando voltando para trás na navigation stack
    navigation.addListener('focus', () => {
		  loadBacias();
		});
  }, [navigation]);

  async function loadBacias() {
    try {
      const data = await buscaTodos('baciahidro');
      if (Array.isArray(data)) {
        setBacias(data);
      } else {
        throw new Error('Dados retornados não são um array');
      }
    } catch (error) {
      console.error('Erro ao carregar bacias:', error);
      Alert.alert('Erro', 'Erro ao carregar bacias. Veja o console para mais detalhes.');
    }
  }

  function handleDeleteBacia(id) {
    Alert.alert(
      "Confirmar Exclusão",
      "Deseja realmente excluir esta bacia hidrográfica?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await exclui('baciahidro', id);
              loadBacias();
            } catch (error) {
              console.error('Erro ao excluir a bacia hidrográfica:', error);
              Alert.alert('Erro', 'Erro ao excluir a bacia hidrográfica. Veja o console para mais detalhes.');
            }
          }
        }
      ]
    );
  }

  function handleEditBacia(id) {
    navigation.navigate('CadastroBaciaHidrografica', { baciaId: id });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bacias Hidrográficas Cadastradas</Text>

      {bacias.length === 0 ? (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>Não há bacias cadastradas.</Text>
        </View>
      ) : (
        <FlatList
          data={bacias}
          keyExtractor={(item) => item.CodBacia.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text>{item.NomeBacia}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditBacia(item.CodBacia)}
                >
                  <Text style={styles.buttonText}>Atualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteBacia(item.CodBacia)}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CadastroBaciaHidrografica')}
      >
        <Text style={styles.buttonText}>Cadastrar Bacia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CadastrosBasicos')}
      >
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

export default ListagemBaciahidro;




