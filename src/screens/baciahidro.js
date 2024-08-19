import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { openDatabase } from '../../database.js';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { useNavigation } from '@react-navigation/native';

const BaciasScreen = () => {
  const [bacias, setBacias] = useState([]);
  const [nomeBacia, setNomeBacia] = useState('');
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
        fetchBacias(database);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

  const createTable = (database) => {
    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS bacia (
          CodBacia INTEGER PRIMARY KEY AUTOINCREMENT,
          NomeBacia TEXT NOT NULL
        );`,
        [],
        () => console.log('Table created successfully'),
        (tx, error) => console.error('Error creating table:', error)
      );
    });
  };

  const fetchBacias = (database) => {
    if (!database) {
      console.error('Database is not initialized');
      return;
    }

    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM bacia',
        [],
        (tx, results) => {
          const baciasList = [];
          for (let i = 0; i < results.rows.length; i++) {
            baciasList.push(results.rows.item(i));
          }
          setBacias(baciasList);
        },
        (tx, error) => console.error('Error fetching bacias:', error)
      );
    });
  };

  const insertBacia = async () => {
    if (!db) {
      console.error('Database is not initialized');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO bacia (NomeBacia) VALUES (?)',
        [nomeBacia],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            fetchBacias(db);
            setNomeBacia('');
          }
        },
        (tx, error) => console.error('Error inserting bacia:', error)
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
        <Text style={styles.header}>Cadastro de Bacias Hidrográficas</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome da Bacia Hidrográfica"
          value={nomeBacia}
          onChangeText={setNomeBacia}
        />
        
        <TouchableOpacity style={styles.button} onPress={insertBacia}>
          <Text style={styles.buttonText}>Adicionar Bacia</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        <FlatList
          data={bacias}
          keyExtractor={(item) => item.CodBacia.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.NomeBacia}</Text>
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

export default BaciasScreen;

