import { useNavigation, NavigationProp } from '@react-navigation/native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../utils/firebase';
import { ActivityIndicator } from 'react-native';

type LoginScreenProps = {
  CreateAccount: undefined;
  Feed: undefined;
};

const LoginScreen = () => {
  //Variavel para navegação
  const navigation = useNavigation<NavigationProp<LoginScreenProps>>();

  //Variaveis de estilo
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  //Variaveis para armazenar os valores do usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função para logar o usuário
  const handleLogin = (email: string, password: string) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        alert("Erro ao logar, verifique suas credenciais");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginText}>
        <Text style={styles.title}>Necessario Login</Text>
        <Text>Para acessar essa função do app é necessário um login</Text>
      </View>
      <TextInput
        placeholder="Email"
        style={[styles.input, usernameFocused && styles.inputSelected]}
        onFocus={() => setUsernameFocused(true)}
        onBlur={() => setUsernameFocused(false)}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        style={[styles.input, passwordFocused && styles.inputSelected]}
        secureTextEntry
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => setPasswordFocused(false)}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleLogin(email, password);
        }}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : ''}
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 20,
          marginTop: 10,
        }}>
        <Text>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
          <Text>Criar uma conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#4a4a4a', // Cinza escuro para o título
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d1d1', // Cinza claro para a borda dos inputs
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
  },
  inputSelected: {
    borderColor: '#4a4a4a', // Cinza escuro para o estado selecionado
  },
  button: {
    backgroundColor: '#ff6f61', // Cor principal (coral) para o botão
    padding: 12,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  buttonText: {
    color: '#ffffff', // Texto branco no botão
    fontSize: 16,
  },
  loginText: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#2d4059', // Azul escuro para o texto de login ou links
  },
});

export default LoginScreen;
