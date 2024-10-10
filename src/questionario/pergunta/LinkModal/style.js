import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    modalView: {
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        width: "80%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,   
    },
    modalTitle:{
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
        padding: 10,
        width: "100%"
    },
    modalText: {
        textAlign: "left",
        width: "100%",
        padding: 10,
    },
    ModalButtonGroup: {
        width: "100%",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        margin: 10,
    },
        
    modalButton: {
        backgroundColor: "#d1d1d1",
        borderRadius: 5,
        padding: 10,
        width: "40%",
    },
  
    modalButtonText:{
        color: "#000",
        textAlign: "center",
    },
    input:{
        border: "1 solid #a6a6a6",
        margin: 10,
        padding: 10,
        width: "100%", 
    },
});

export default styles;
