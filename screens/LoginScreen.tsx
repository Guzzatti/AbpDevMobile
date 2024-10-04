import { useNavigation, NavigationProp } from '@react-navigation/native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../utils/firebase';

type LoginScreenProps = {
  CreateAccount: undefined;
  Feed: undefined;
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<LoginScreenProps>>();
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('Feed');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // O usuário está logado, a navegação será tratada por onAuthStateChanged e useEffect
        // deixei só para você saber
      })
      .catch((error) => {
        console.error('Erro ao logar', error);
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
  },
  inputSelected: {
    borderColor: 'gray',
  },
  button: {
    backgroundColor: '#00B9D1',
    padding: 12,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginText: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
