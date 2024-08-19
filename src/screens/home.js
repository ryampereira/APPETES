import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'; 


const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

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
      <Text style={styles.title}>Bem-vindo ao app ETE's</Text>
      <CustomButton
        title="Cadastro de Municípios"
        onPress={() => navigation.navigate('MunicipiosScreen')}
      />
      <CustomButton
        title="Cadastro de Bacias Hidrográficas"
        onPress={() => navigation.navigate('BaciasScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E0E0E0', 
  },
  title: {
    fontSize: 26,
    fontWeight: '700', 
    marginBottom: 40,
    color: '#37474F',
    textAlign: 'center',
    fontFamily: 'Roboto_700Bold', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, 
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
});

export default HomeScreen;

