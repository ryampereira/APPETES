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
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#381704',
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
  },
  listItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  respostasContainer: {
    marginTop: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'gray',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#8B4513', // Cor marrom para a seleção
    backgroundColor: '#8B4513', // Cor marrom quando selecionado
  },
  radioButtonLabel: {
    fontSize: 16,
    color: '#381704',
  },
});

export default styles;
