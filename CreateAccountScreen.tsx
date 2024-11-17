import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { handleRegister } from 'utils/Functions';

const CreateAccountScreen = () => {
  //Variaveis para estilização dos inputs
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused1, setPasswordFocused1] = useState(false);
  const [passwordFocused2, setPasswordFocused2] = useState(false);
  const [loading, setLoading] = useState(false);

  //Variaveis para armazenar os valores para a criação da conta
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.registerText}>
        <Text style={styles.title}>Criação de conta</Text>
      </View>
      <TextInput
        placeholder="Username"
        style={[styles.input, usernameFocused && styles.inputSelected]}
        onFocus={() => setUsernameFocused(true)}
        onBlur={() => setUsernameFocused(false)}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Email"
        style={[styles.input, emailFocused && styles.inputSelected]}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={[styles.input, passwordFocused1 && styles.inputSelected]}
        secureTextEntry
        onFocus={() => setPasswordFocused1(true)}
        onBlur={() => setPasswordFocused1(false)}
        value={password1}
        onChangeText={setPassword1}
      />
      <TextInput
        placeholder="Password"
        style={[styles.input, passwordFocused2 && styles.inputSelected]}
        secureTextEntry
        onFocus={() => setPasswordFocused2(true)}
        onBlur={() => setPasswordFocused2(false)}
        value={password2}
        onChangeText={setPassword2}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => [handleRegister(email, password1, password2, username),setLoading(true)]}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Criar conta</Text>
        )}
      </TouchableOpacity>
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
    borderColor: '#ff6f61', // Vermelho para a borda dos inputs selecionados
  },
  button: {
    backgroundColor: '#ff6f61', // cor principal para botões de ação
    padding: 12,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff', // Branco no texto do botão
    fontSize: 16,
  },
  registerText: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#2d4059', // Azul escuro para texto de registro ou links
  },
});

export default CreateAccountScreen;
