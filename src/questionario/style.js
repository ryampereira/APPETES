import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 30, // Aumenta o tamanho da fonte
    fontWeight: 'bold', // Torna o texto mais ousado
    marginBottom: 20, // Reduz a margem inferior para compactar
    marginTop: 60, // Ajusta a margem superior
    color: '#381704',
    textAlign: 'center',
    borderBottomWidth: 2, // Adiciona uma linha abaixo
    borderBottomColor: '#8B4513', // Cor da linha
    paddingBottom: 10, // Adiciona espaço abaixo do texto
  },
  button: {
    backgroundColor: '#381704',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10, 
    marginBottom: 30,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  }
});

export default styles;
