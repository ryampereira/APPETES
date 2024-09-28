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
    borderColor: '#8B4513', // Cor marrom para a seleção
    backgroundColor: '#8B4513', // Cor marrom quando selecionado
  },
  radioButtonLabel: {
    fontSize: 16,
    color: '#381704',
  },
  buttonCamera: {
    border: "2px solid black",
    width: 150,
    height: 150,
    // margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 5,
    right: 20,
  }
});

export default styles;
