import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'; // Importação das fontes

const HomeScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App IQE</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('CadastrosBasicos')}
      >
        <Text style={styles.buttonText}>Cadastros Básicos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ListagemETEs')} 
      >
        <Text style={styles.buttonText}>Cadastrar ETEs</Text> 
      </TouchableOpacity>

      {/* Novo botão para Listagem de Avaliações de IQE */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ListagemAvaliacaoIQE')} 
      >
        <Text style={styles.buttonText}>Cadastrar IQE</Text> 
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5', 
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10, 
    marginTop: 20, 
    color: '#381704', 
    textAlign: 'center',
    fontFamily: 'Roboto_700Bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: '#381704', 
    paddingVertical: 12,
    paddingHorizontal: 24,
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
});

export default HomeScreen;




