import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db, storage } from './firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { UserType } from 'types';

//registrar usuarios
async function saveImage(userId: string) {
  const uri =
    'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png';

  // Converte a URI da imagem em um blob para ser carregada no Firebase
  const response = await fetch(uri);
  const blob = await response.blob();

  // Cria uma referência no Firebase Storage
  const storageRef = ref(storage, `users/${userId}/profile.jpg`);

  // Faz o upload da imagem para o Firebase Storage
  await uploadBytes(storageRef, blob);

  // Obtém a URL da imagem carregada
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

//Função para criar uma conta
async function handleRegister(
  email: string,
  password1: string,
  password2: string,
  username: string
) {
  if (!username || !email || !password1 || !password2) {
    alert('Preencha todos os campos');
    return;
  }
  if (username.length < 2) {
    alert('Username precisa ter pelo menos 2 caracteres');
    return;
  }
  if (password1 !== password2) {
    alert('As senhas não coincidem');
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password1);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      username: username,
      email: email,
      profileImageUrl: await saveImage(user.uid),
      following: [],
      followers: [],
      recentSearches: [],
    } as UserType);
  } catch (e) {
    console.error(e);
    alert('Erro ao criar usuário');
  }
}

export { handleRegister };
