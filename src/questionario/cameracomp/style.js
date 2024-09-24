import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 20
  },

  buttonPhoto:{
    backgroundColor: "#E8E8E8",
    padding: 10,
    width: "35%",
    alignItems: "center",
    borderRadius: 10,
    border: "1px solid black",
    margin: 20
  },

  buttonCamera: {
    margin: "0px 50px"
  },

cameraContainer : {
    flexDirection: "row",
    marginTop: "135%",
    justifyContent: "center",
    alignItems: "center"

},
buttonSave:{
    backgroundColor: "#E8E8E8",
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    border: "1px solid black",
    marginBottom: 20,

 },

 modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center"
 },

 mContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center"
 },
 
 modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center"
 },

 buttonModalContainer: {
    flexDirection: "row",
    justifyContent: "space-around"
 }
});

export default styles;