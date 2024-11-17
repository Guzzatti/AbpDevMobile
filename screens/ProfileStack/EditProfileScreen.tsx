import { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from 'utils/firebase'; // Certifique-se de que o Firebase está configurado corretamente

export default function EditProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Erro', 'Nenhuma imagem selecionada.');
      return;
    }

    try {
      setUploading(true);

      // Converte a URI da imagem em um blob para ser carregada no Firebase
      const response = await fetch(image);
      const blob = await response.blob();

      // Obtém o ID do usuário autenticado
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      // Cria uma referência no Firebase Storage
      const storageRef = ref(getStorage(), `users/${userId}/profile.jpg`);

      // Faz o upload da imagem para o Firebase Storage
      await uploadBytes(storageRef, blob);

      // Obtém a URL da imagem carregada
      const downloadURL = await getDownloadURL(storageRef);

      // Atualiza o Firestore com a URL da imagem
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { profileImageUrl: downloadURL });

      Alert.alert('Sucesso', 'Imagem de perfil atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      Alert.alert('Erro', 'Não foi possível fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Escolher uma imagem" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && (
        <Button title="Salvar Imagem" onPress={uploadImage} disabled={uploading} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});