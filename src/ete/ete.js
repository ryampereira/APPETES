import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper'; 
import styles from './styles';
import { inclui, atualiza, exclui, buscaTodos } from '../services/dbservice';

const CadastroETE = ({ navigation, route }) => {
  const [ete, setEte] = useState({
    NomeETE: '',
    Endereco: '',
    VazaoMediaDiaMedida: '',
    VazaoMediaDiaProj: '',
    NivelTratamento: '',
    PopulacaoRealAtend: '',
    PopulacaoRealAno: '',
    PopulacaoRealProj: '',
    PopulacaoProjAno: '',
    RegimeOper: '',
    Ocupacao: '',
    RecebePercolado: '',
    RecebeLodoFossaBan: '',
    Operadora: '',
    RespTecnico: '',
    Contato: '',
    Zoneamento: '',
    AreaOcupada: '',
    CodBaciaHidro: '',
    CodMun: '',
  });

  const [bacias, setBacias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [selectedETE, setSelectedETE] = useState(null);

  useEffect(() => {
    loadBacias();
    loadMunicipios();

    if (route.params?.eteId) {
      const fetchETE = async () => {
        try {
          const data = await buscaTodos('ete');
          const ete = data.find(e => e.CodETE === route.params.eteId);
          if (ete) {
            setSelectedETE(ete);
            setEte({
              NomeETE: ete.NomeETE || '',
              Endereco: ete.Endereco || '',
              VazaoMediaDiaMedida: (ete.VazaoMediaDiaMedida || '').toString(),
              VazaoMediaDiaProj: (ete.VazaoMediaDiaProj || '').toString(),
              NivelTratamento: ete.NivelTratamento || '',
              PopulacaoRealAtend: (ete.PopulacaoRealAtend || '').toString(),
              PopulacaoRealAno: (ete.PopulacaoRealAno || '').toString(),
              PopulacaoRealProj: (ete.PopulacaoRealProj || '').toString(),
              PopulacaoProjAno: (ete.PopulacaoProjAno || '').toString(),
              RegimeOper: ete.RegimeOper || '',
              Ocupacao: ete.Ocupacao || '',
              RecebePercolado: (ete.RecebePercolado || '').toString(),
              RecebeLodoFossaBan: (ete.RecebeLodoFossaBan || '').toString(),
              Operadora: ete.Operadora || '',
              RespTecnico: ete.RespTecnico || '',
              Contato: ete.Contato || '',
              Zoneamento: ete.Zoneamento || '',
              AreaOcupada: ete.AreaOcupada || '',
              CodBaciaHidro: ete.CodBaciaHidro || '',
              CodMun: ete.CodMun || '',
            });
          }
        } catch (error) {
          console.error('Erro ao buscar ETE:', error);
          Alert.alert('Erro', 'Erro ao carregar os dados da ETE.');
        }
      };
      fetchETE();
    }
  }, [route.params?.eteId]);

  async function loadBacias() {
    try {
      const data = await buscaTodos('baciahidro');
      if (Array.isArray(data)) {
        setBacias(data);
      } else {
        throw new Error('Os dados retornados não são uma lista válida.');
      }
    } catch (error) {
      console.error('Erro ao carregar bacias:', error);
      Alert.alert('Erro', 'Erro ao carregar bacias.');
    }
  }

  async function loadMunicipios() {
    try {
      const data = await buscaTodos('municipio');
      if (Array.isArray(data)) {
        setMunicipios(data);
      } else {
        throw new Error('Os dados retornados não são uma lista válida.');
      }
    } catch (error) {
      console.error('Erro ao carregar municípios:', error);
      Alert.alert('Erro', 'Erro ao carregar municípios.');
    }
  }

  function validateFields() {
    const isUpdateMode = selectedETE;
  
    for (let key in ete) {
      if (['VazaoMediaDiaMedida', 'VazaoMediaDiaProj', 'PopulacaoRealAtend', 'PopulacaoRealAno', 'PopulacaoRealProj', 'PopulacaoProjAno', 'RecebePercolado', 'RecebeLodoFossaBan'].includes(key)) {
        let value = ete[key];
  
        if (isUpdateMode && (value === '' || value === null || value === undefined)) {
          ete[key] = 0;  
          value = 0;
        }
  
        if (isNaN(value)) {
          console.log(`Campo numérico inválido: ${key} - Valor: ${ete[key]}`);
          return false;
        }
      } else {
        if (!isUpdateMode && (ete[key] === null || ete[key] === undefined || (typeof ete[key] === 'string' && ete[key].trim() === ''))) {
          console.log(`Campo inválido: ${key} - Valor: ${ete[key]}`);
          return false;
        }
      }
    }
    return true;
  }
  
  
  

  async function handleSaveETE() {
    if (validateFields()) {
      try {
        const formattedEte = { ...ete };
          ['RecebePercolado', 'RecebeLodoFossaBan'].forEach(field => {
          if (ete[field] === undefined || ete[field] === '') {
            formattedEte[field] = 0;
          } else {
            const numericValue = parseInt(ete[field], 10);
            if (numericValue === 0 || numericValue === 1) {
              formattedEte[field] = numericValue;  
            } else {
              formattedEte[field] = 0;
              console.log(`Campo numérico inválido: ${field} - Valor: ${ete[field]}`);
            }
          }
        });
  
        ['VazaoMediaDiaMedida', 'VazaoMediaDiaProj', 'PopulacaoRealAtend', 'PopulacaoRealAno', 'PopulacaoRealProj', 'PopulacaoProjAno'].forEach(field => {
          formattedEte[field] = parseFloat(ete[field]) || 0;  
        });
  
        if (selectedETE) {
          console.log('Atualizando ETE:', formattedEte);
          await atualiza('ete', selectedETE.CodETE, formattedEte);
        } else {
          console.log('Inserindo ETE:', formattedEte);
          await inclui('ete', formattedEte);
        }
  
        resetForm();
        navigation.navigate('HomeScreen');
      } catch (error) {
        console.error('Erro ao salvar o ETE:', error);
        Alert.alert('Erro', 'Erro ao salvar o ETE.');
      }
    } else {
      Alert.alert('Atenção', 'Todos os campos são obrigatórios');
    }
  }
  
  


  function resetForm() {
    setEte({
      NomeETE: '',
      Endereco: '',
      VazaoMediaDiaMedida: '',
      VazaoMediaDiaProj: '',
      NivelTratamento: '',
      PopulacaoRealAtend: '',
      PopulacaoRealAno: '',
      PopulacaoRealProj: '',
      PopulacaoProjAno: '',
      RegimeOper: '',
      Ocupacao: '',
      RecebePercolado: '',
      RecebeLodoFossaBan: '',
      Operadora: '',
      RespTecnico: '',
      Contato: '',
      Zoneamento: '',
      AreaOcupada: '',
      CodBaciaHidro: '',
      CodMun: '',
    });
    setSelectedETE(null);
  }

  async function handleDeleteETE(id) {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este ETE?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await exclui('ete', id);
              resetForm();
              navigation.navigate('HomeScreen');
            } catch (error) {
              console.error('Erro ao excluir o ETE:', error);
              Alert.alert('Erro', 'Erro ao excluir o ETE.');
            }
          }
        }
      ]
    );
  }

  function handleCancel() {
    navigation.navigate('ListagemETEs');
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{selectedETE ? 'Atualizar ETE' : 'Cadastrar'}</Text>

      {Object.keys(ete)
  .filter(key => !['CodBaciaHidro', 'CodMun'].includes(key))
  .map((key) => (
    <View key={key} style={styles.inputGroup}>
      <Text style={styles.label}>{formatFieldLabel(key)}:</Text>

      {key === 'RecebePercolado' || key === 'RecebeLodoFossaBan' ? (
        <RadioButton.Group
          onValueChange={value => setEte({ ...ete, [key]: value })}
          value={ete[key] !== undefined ? (ete[key] === '1' ? '1' : '0') : '0'} 
        >
          <View style={styles.radioButtonGroup}>
            <Text>Sim</Text>
            <RadioButton value="1" />
            <Text>Não</Text>
            <RadioButton value="0" />
          </View>
        </RadioButton.Group>
      ) : (
        <TextInput
          style={styles.textInput}
          placeholder={`Digite ${formatFieldLabel(key)}`}
          value={ete[key]}
          keyboardType={['VazaoMediaDiaMedida', 'VazaoMediaDiaProj', 'PopulacaoRealAtend', 'PopulacaoRealAno', 'PopulacaoRealProj', 'PopulacaoProjAno'].includes(key) ? 'numeric' : 'default'}
          onChangeText={value => setEte({ ...ete, [key]: value })}
        />
      )}
    </View>
))}


      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bacia Hidrográfica:</Text>
        <Picker
          selectedValue={ete.CodBaciaHidro}
          style={styles.picker}
          onValueChange={(value) => setEte({ ...ete, CodBaciaHidro: value })}
        >
          <Picker.Item label="Selecione uma Bacia Hidrográfica" value="" />
          {bacias.map((bacia) => (
            <Picker.Item key={bacia.CodBacia} label={bacia.NomeBacia} value={bacia.CodBacia} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Município:</Text>
        <Picker
          selectedValue={ete.CodMun}
          style={styles.picker}
          onValueChange={(value) => setEte({ ...ete, CodMun: value })}
        >
          <Picker.Item label="Selecione um Município" value="" />
          {municipios.map((municipio) => (
            <Picker.Item key={municipio.CodMun} label={municipio.NomeMun} value={municipio.CodMun} />
          ))}
        </Picker>
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSaveETE}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Função para formatar o label do campo
function formatFieldLabel(key) {
  const labels = {
    NomeETE: 'Nome da ETE',
    Endereco: 'Endereço',
    VazaoMediaDiaMedida: 'Vazão Média Dia (Medida)',
    VazaoMediaDiaProj: 'Vazão Média Dia (Projeto)',
    NivelTratamento: 'Nível de Tratamento',
    PopulacaoRealAtend: 'População Real Atendida',
    PopulacaoRealAno: 'População Real (Ano)',
    PopulacaoRealProj: 'População Real (Projeto)',
    PopulacaoProjAno: 'População Projetada (Ano)',
    RegimeOper: 'Regime Operacional',
    Ocupacao: 'Ocupação',
    RecebePercolado: 'Recebe Percolado',
    RecebeLodoFossaBan: 'Recebe Lodo de Fossa e Banheiro',
    Operadora: 'Operadora',
    RespTecnico: 'Responsável Técnico',
    Contato: 'Contato',
    Zoneamento: 'Zoneamento',
    AreaOcupada: 'Área Ocupada'
  };
  return labels[key] || key;
}

export default CadastroETE;
