import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { openDatabase } from '../../database.js';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { useNavigation } from '@react-navigation/native';

const MunicipiosScreen = () => {
  const [municipios, setMunicipios] = useState([]);
  const [nomeMun, setNomeMun] = useState('');
  const [populacaoAprox, setPopulacaoAprox] = useState('');
  const [db, setDb] = useState(null);

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const navigation = useNavigation();

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const database = await openDatabase();
        setDb(database);
        createTable(database);
        fetchMunicipios(database);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

  const createTable = (database) => {
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS municipio (
          CodMun INTEGER PRIMARY KEY AUTOINCREMENT,
          NomeMun TEXT NOT NULL,
          PopulacaoAprox INTEGER NOT NULL
        );`,
        [],
        () => console.log('Table created successfully'),
        (tx, error) => console.error('Error creating table:', error)
      );
    });
  };

  const fetchMunicipios = (database) => {
    if (!database) {
      console.error('Database is not initialized');
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM municipio',
        [],
        (tx, results) => {
          const municipiosList = [];
          for (let i = 0; i < results.rows.length; i++) {
            municipiosList.push(results.rows.item(i));
          }
          setMunicipios(municipiosList);
        },
        (tx, error) => console.error('Error fetching municipios:', error)
      );
    });
  };

  const insertMunicipio = async () => {
    if (!db) {
      console.error('Database is not initialized');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO municipio (NomeMun, PopulacaoAprox) VALUES (?, ?)',
        [nomeMun, parseInt(populacaoAprox)],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            fetchMunicipios(db);
            setNomeMun('');
            setPopulacaoAprox('');
          }
        },
        (tx, error) => console.error('Error inserting municipio:', error)
      );
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Cadastro de Municípios</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome do Município"
          value={nomeMun}
          onChangeText={setNomeMun}
        />
        
        <TextInput
          style={styles.input}
          placeholder="População Aproximada"
          value={populacaoAprox}
          onChangeText={setPopulacaoAprox}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.button} onPress={insertMunicipio}>
          <Text style={styles.buttonText}>Adicionar Município</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        <FlatList
          data={municipios}
          keyExtractor={(item) => item.CodMun.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.NomeMun}</Text>
              <Text style={styles.itemText}>População Aproximada: {item.PopulacaoAprox}</Text>
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    color: '#37474F',
    textAlign: 'center',
    fontFamily: 'Roboto_700Bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#B0BEC5',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontFamily: 'Roboto_400Regular',
  },
  button: {
    backgroundColor: '#607D8B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Roboto_400Regular',
    letterSpacing: 1.1,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#B0BEC5',
    width: '100%',
  },
  itemText: {
    fontSize: 16,
    color: '#37474F',
    fontFamily: 'Roboto_400Regular',
  },
  backButton: {
    backgroundColor: '#607D8B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    elevation: 2,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
  },
});

export default MunicipiosScreen;

