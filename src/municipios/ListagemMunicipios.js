import React, { useState, useEffect } from 'react';
import { View, Text, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { exclui, buscaTodos } from '../services/dbservice';

const ListagemMunicipios = ({ navigation }) => {
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    // Evita renderizar dados antigos quando voltando para trás na navigation stack
    navigation.addListener('focus', () => {
		  loadMunicipios();
		});
  }, [navigation]);

  async function loadMunicipios() {
    try {
      const data = await buscaTodos('municipio');
      console.log('Dados retornados:', data);
      if (Array.isArray(data)) {
        setMunicipios(data);
      } else {
        throw new Error('Dados retornados não são um array');
      }
    } catch (error) {
      console.error('Erro ao carregar municípios:', error);
      alert('Erro ao carregar municípios. Veja o console para mais detalhes.');
    }
  }

  function handleDeleteMunicipio(id) {
    Alert.alert(
      "Confirmar Exclusão",
      "Deseja realmente excluir este município?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await exclui('municipio', id);
              loadMunicipios();
            } catch (error) {
              console.error('Erro ao excluir o município:', error);
              alert('Erro ao excluir o município. Veja o console para mais detalhes.');
            }
          }
        }
      ]
    );
  }

  function handleEditMunicipio(municipio) {
    navigation.navigate('CadastroMunicipio', { municipioId: municipio.CodMun });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Municípios cadastrados</Text>

      {municipios.length === 0 ? (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>Não há municípios cadastrados.</Text>
        </View>
      ) : (
        <FlatList
          data={municipios}
          keyExtractor={(item) => item.CodMun.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text>{item.NomeMun}</Text>
                <Text>População Aproximada: {item.PopulacaoAprox}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditMunicipio(item)}>
                  <Text style={styles.buttonText}>Atualizar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMunicipio(item.CodMun)}>
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastroMunicipio')}>
        <Text style={styles.buttonText}>Cadastrar Município</Text>
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

export default ListagemMunicipios;
