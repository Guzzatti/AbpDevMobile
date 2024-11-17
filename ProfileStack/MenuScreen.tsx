import { useState,useEffect } from "react";
import { View,Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "types";
import { signOut } from "firebase/auth";
import { auth } from "utils/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";


const handleLogout = async () => {
  signOut(auth).catch((error) => {
    console.log('Erro ao sair da conta', error);
  });
};

function MenuScreen() {
  
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleLogout()} style={styles.button}>
          <Text style={styles.buttonText}>Sair da conta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileScreen')}
          style={styles.button}>
          <Text style={styles.buttonText}>Selecionar foto de perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MenuScreen;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: '#ff6f61',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    padding: 16,
    gap: 16,
  },
});

