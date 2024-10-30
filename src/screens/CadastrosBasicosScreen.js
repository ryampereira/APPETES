import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'; 
import { Ionicons } from '@expo/vector-icons'; // Importa o Ionicons

const CadastrosBasicosScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      {/* Botão de seta para voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomeScreen')}>
        <Ionicons name="arrow-back" size={24} color="#381704" />
      </TouchableOpacity>

      <Text style={styles.title}>Cadastros Básicos</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ListagemMunicipios')}
      >
        <Text style={styles.buttonText}>Municípios</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ListagemBaciahidro')}
      >
        <Text style={styles.buttonText}>Bacia Hidrográfica</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ListagemAvaliadores')} 
      >
        <Text style={styles.buttonText}>Avaliadores</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5', 
  },
  backButton: {
    position: 'absolute', // Posiciona o botão no canto superior esquerdo
    top: 40, // Distância do topo
    left: 20, // Distância da esquerda
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30, 
    marginTop: 100, 
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
    marginVertical: 15, 
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

export default CadastrosBasicosScreen;









