import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ImportModal = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Modal de Importação</Text>
      <Button title="Fechar" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImportModal;
