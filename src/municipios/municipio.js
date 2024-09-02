import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from './styles'; 
import { inclui, atualiza, buscaTodos } from '../services/dbservice';

const CadastroMunicipio = ({ navigation, route }) => {
  const [nome, setNome] = useState('');
  const [populacaoAprox, setPopulacaoAprox] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);

  useEffect(() => {
    // Se há um município selecionado, preenche os campos de entrada com seus dados
    if (route.params?.municipioId) {
      const fetchMunicipio = async () => {
        try {
          const data = await buscaTodos('municipio');
          const municipio = data.find(m => m.CodMun === route.params.municipioId);
          if (municipio) {
            setSelectedMunicipio(municipio);
            setNome(municipio.NomeMun);
            setPopulacaoAprox(municipio.PopulacaoAprox.toString());
          }
        } catch (error) {
          console.error('Erro ao buscar município:', error);
        }
      };
      fetchMunicipio();
    }
  }, [route.params?.municipioId]);

  async function handleSaveMunicipio() {
    const data = {
      NomeMun: nome,
      PopulacaoAprox: parseInt(populacaoAprox, 10),
    };

    if (nome && populacaoAprox) {
      try {
        if (selectedMunicipio) {
          await atualiza('municipio', selectedMunicipio.CodMun, data);
        } else {
          await inclui('municipio', data);
        }
        resetForm();
        navigation.navigate('ListagemMunicipios'); 
      } catch (error) {
        console.error('Erro ao salvar o município:', error);
        alert('Erro ao salvar o município. Veja o console para mais detalhes.');
      }
    } else {
      alert('Todos os campos são obrigatórios');
    }
  }

  function resetForm() {
    setNome('');
    setPopulacaoAprox('');
    setSelectedMunicipio(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cadastro Município</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Município</Text>
        <TextInput
          placeholder="Digite o nome do município"
          onChangeText={setNome}
          value={nome}
          style={styles.textInput}
        />
        <Text style={styles.label}>População Aproximada</Text>
        <TextInput
          placeholder="Digite a população aproximada"
          onChangeText={setPopulacaoAprox}
          value={populacaoAprox}
          keyboardType="numeric"
          style={styles.textInput}
        />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListagemMunicipios')}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSaveMunicipio}>
          <Text style={styles.buttonText}>{selectedMunicipio ? 'Atualizar' : 'Cadastrar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CadastroMunicipio;