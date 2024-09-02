import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from './styles'; 
import { inclui, atualiza, buscaTodos } from '../services/dbservice';

const CadastroBaciaHidrografica = ({ navigation, route }) => {
  const [nomeBacia, setNomeBacia] = useState('');
  const [selectedBacia, setSelectedBacia] = useState(null);

  useEffect(() => {
    console.log('Parâmetros de navegação:', route.params); // Verificar parâmetros

    if (route.params?.baciaId) {
      const fetchBacia = async () => {
        try {
          const data = await buscaTodos('baciahidro');
          console.log('Dados da tabela baciahidro:', data); // Verificar dados retornados
          const bacia = data.find(b => b.CodBacia === route.params.baciaId);
          console.log('Bacia encontrada:', bacia); // Verificar bacia encontrada
          if (bacia) {
            setSelectedBacia(bacia);
            setNomeBacia(bacia.NomeBacia);
          } else {
            Alert.alert('Erro', 'Bacia não encontrada.');
          }
        } catch (error) {
          console.error('Erro ao buscar bacia hidrográfica:', error);
          Alert.alert('Erro', 'Erro ao buscar bacia hidrográfica. Veja o console para mais detalhes.');
        }
      };
      fetchBacia();
    }
  }, [route.params?.baciaId]);

  async function handleSaveBacia() {
    const data = { NomeBacia: nomeBacia };

    if (nomeBacia) {
      try {
        if (selectedBacia) {
          console.log('Atualizando bacia com ID:', selectedBacia.CodBacia);
          await atualiza('baciahidro', selectedBacia.CodBacia, data);
        } else {
          console.log('Cadastrando nova bacia:', data);
          await inclui('baciahidro', data);
        }
        resetForm();
        navigation.navigate('ListagemBaciahidro'); 
      } catch (error) {
        console.error('Erro ao salvar a bacia hidrográfica:', error);
        Alert.alert('Erro', 'Erro ao salvar a bacia hidrográfica. Veja o console para mais detalhes.');
      }
    } else {
      Alert.alert('Atenção', 'Todos os campos são obrigatórios');
    }
  }

  function resetForm() {
    setNomeBacia('');
    setSelectedBacia(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cadastro de Bacia Hidrográfica</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome da Bacia Hidrográfica</Text>
        <TextInput
          placeholder="Digite o nome da bacia"
          onChangeText={setNomeBacia}
          value={nomeBacia}
          style={styles.textInput}
        />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('ListagemBaciahidro')}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSaveBacia}
        >
          <Text style={styles.buttonText}>{selectedBacia ? 'Atualizar' : 'Cadastrar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CadastroBaciaHidrografica;

