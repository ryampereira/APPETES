import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, Text, Modal, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Sharing from 'expo-sharing';
import * as ImageManipulator from 'expo-image-manipulator';
import { Fontisto, Ionicons, FontAwesome } from '@expo/vector-icons';
import { salvaFoto } from '../../services/questionarioservice';

import styles from './style';

const Camera = ({ visible, closeCamera, onPhotoTaken, capturedPhoto, codInd, codAval }) => {

  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null); // Mudança: inicializar photo como null
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [facing, setFacing] = useState('back');
  const previousFacing = useRef(facing);
  const photoRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  function flipCamera() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  useEffect(() => {
    if (capturedPhoto) {
      photoRef.current = capturedPhoto;
      setPhoto({ uri: capturedPhoto }); 
      setShowPreview(true);
    }
  }, [capturedPhoto]);

  const takePicture = async () => {
    if (camera) {
      const photoData = await camera.takePictureAsync();
      const compressedPhoto = await compressImage(photoData);
      setPhoto(compressedPhoto.uri);
      photoRef.current = compressedPhoto.uri;
      setShowPreview(true);
    }
  };

  const compressImage = async (photoData) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      photoData.uri,
      [],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult;
  };

  const sharePhoto = async () => {
    if (photoRef.current) {
      await Sharing.shareAsync(photoRef.current);
    }
  };

  const deletePhoto = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePhoto = async () => {
    try {
      await salvaFoto(null, codInd, codAval);
      setPhoto(null);
      photoRef.current = null;
      setShowPreview(false);
      setShowDeleteConfirmation(false);
      onPhotoTaken("");
      handleClose();
    } catch (e) {
      Alert.alert("Erro", "Erro ao deletar imagem");
    }
  };

  const cancelDeletePhoto = () => {
    setShowDeleteConfirmation(false);
  };

  const onCameraReady = () => {
    if (previousFacing.current !== facing) {
      previousFacing.current = facing;
      setPhoto(null);
      setShowPreview(false);
    }
  };

  const handleClose = async () => {
    if (camera && camera.status === 'READY') {
      if (camera.isRecording) {
        camera.stopRecording();
      }
      await camera.unloadAsync();
      setCamera(null);
    }
    closeCamera();
  };

  const handleSavePhoto = async () => {
    if (photoRef.current || capturedPhoto) {
      try {
        const photoToSave = capturedPhoto ? capturedPhoto : photoRef.current;
        await salvaFoto(photoToSave, codInd, codAval);
        onPhotoTaken(photoToSave);
        handleClose();
      } catch (e) {
        Alert.alert("Erro", "Erro ao salvar imagem");
      }
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={{flex: 1}}>
        <Text style={{ textAlign: 'center' }}>Precisamos da permissão de sua câmera</Text>
        <Button onPress={() => requestPermission()} title="Permitir" />
      </View>
    );
  }

  return (
    <Modal visible={visible} onRequestClose={() => handleClose()} animationType="slide">
      <View style={{ flex: 1 }}>
        {(capturedPhoto || showPreview) ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={{ uri: (capturedPhoto ? capturedPhoto : photo) }} style={{ width: '90%', height: '50%', resizeMode: 'contain', borderRadius: 10 }} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonPhoto} onPress={() => sharePhoto()}>
                <Text>Compartilhar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonPhoto} onPress={() => deletePhoto()}>
                <Text>Excluir</Text>
              </TouchableOpacity>
              
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonSave} onPress={() => handleSavePhoto()}>
                <Text>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <CameraView style={{ flex: 1 }} ref={(ref) => setCamera(ref)} facing={facing} onCameraReady={onCameraReady}>
            <View style={styles.cameraContainer}>
               <TouchableOpacity style={styles.buttonCamera} onPress={() => handleClose()}>
                 <Ionicons name="close" size={40} color="white" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.buttonCamera} onPress={() => takePicture()}>
                 <FontAwesome name="dot-circle-o" size={80} color="white" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.buttonCamera} onPress={() => flipCamera()}>
                 <Fontisto name="arrow-return-right" size={30} color="white" />
               </TouchableOpacity>
             </View>
          </CameraView>
        )}
        <Modal visible={showDeleteConfirmation} transparent animationType="fade">
          <View style={styles.mContainer}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Tem certeza que deseja excluir a imagem?</Text>
              <View style={styles.buttonModalContainer}>
                <TouchableOpacity style={styles.buttonPhoto} onPress={() => confirmDeletePhoto()}>
                  <Text>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonPhoto} onPress={() => cancelDeletePhoto()}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

export default Camera;