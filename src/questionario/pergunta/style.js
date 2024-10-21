import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#381704',
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
    borderColor: '#8B4513',
    backgroundColor: '#8B4513',
  },
  radioButtonLabel: {
    fontSize: 16,
    color: '#381704',
  },
  buttonCamera: {
    borderWidth: 2,
    borderColor: '#381704',
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center", // Centraliza o conteúdo
    borderRadius: 10,
    marginRight: 500, // Espaço entre o botão da câmera e o próximo
    marginTop: -60,
  },
  cameraIcon: {
    width: 20, // Largura do ícone da câmera
    height: 60, // Altura do ícone da câmera
  },
  closeIcon: {
    position: "absolute",
    top: 5,
    right: 20,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center", // Centraliza os botões
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    marginTop: 50,
  },
  buttonLink: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#24a0ed",
    height: 60, // Certifique-se que a altura do botão link é a mesma do botão câmera
    borderRadius: 10,
    paddingVertical: 1,
    paddingHorizontal: 15,
    marginLeft: 100,
    marginTop: 20,
  },
  linkText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  }
});

export default styles;









