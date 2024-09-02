import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'; // Importação das fontes

const CadastrosBasicosScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Adicione um indicador de carregamento, se preferir
  }

  return (
    <View style={styles.container}>
      {/* Botão voltar no canto superior esquerdo */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.backButtonText}>Voltar</Text>
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

      {/* Novo botão para listar avaliadores */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ListagemAvaliadores')} // Rota para a listagem de avaliadores
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
    position: 'absolute',
    top: 50, 
    left: 16,
    backgroundColor: '#381704', 
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30, // Margem inferior ajustada para descer o texto
    marginTop: 100, // Margem superior ajustada para descer o texto
    color: '#381704', // Cor amarronzada
    textAlign: 'center',
    fontFamily: 'Roboto_700Bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: '#381704', // Cor amarronzada
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 15, // Margem vertical ajustada para descer os botões
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








