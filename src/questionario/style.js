import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 5, // Distância do cabeçalho reduzida
    marginTop: 15, 
    color: '#381704',
    textAlign: 'center',
    borderBottomWidth: 2, 
    borderBottomColor: '#8B4513', 
    paddingBottom: 10, 
  },
  nomeETE: {
    fontSize: 15,
    fontWeight: '600', 
    color: '#381704', 
    textAlign: 'center', 
    marginBottom: 20,  
    borderBottomColor: '#8B4513', 
    paddingBottom: 10, 
  },
  button: {
    backgroundColor: '#381704',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 15, 
    marginBottom: 2,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  fixedPontuacaoContainer: {
    backgroundColor: '#FAEBD7', // Tom de bege mais claro
    paddingVertical: 8, // Padding reduzido
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10, // Distância do topo ajustada
    alignItems: 'center',
    zIndex: 1, // Garante que a pontuação fique acima de outros elementos
    position: 'absolute', // Mantém a pontuação fixa
    top: 20, // Posição fixa do topo
    left: 16,
    right: 16,
  },
  fixedPontuacao: {
    fontSize: 15, // Tamanho da fonte menor
    color: '#381704',
  },
  scrollContainer: {
    paddingBottom: 70, // Para garantir espaço na parte inferior
    marginTop: 80, // Ajuste o valor se necessário para não sobrepor o cabeçalho
  },
});

export default styles;


