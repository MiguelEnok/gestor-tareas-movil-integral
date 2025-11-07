import { auth, signInWithEmailAndPassword } from '@/screens/firebaseConfig';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/')
    } catch (error) {
      alert('Error: ' + error.message);
      alert('Error de inicio de sesión: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput style={styles.input} placeholder="Correo" onChangeText={setEmail} value={email} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry onChangeText={setPassword} value={password} />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Entrar</Text>
      </TouchableOpacity>

      {/* Navegación con Expo Router */}
      <TouchableOpacity onPress={() => router.push('/(auth)/RegisterScreen')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, color: '#000', marginBottom: 20 },
  input: { width: '80%', padding: 10, borderBottomWidth: 1, borderColor: '#000', marginBottom: 15 },
  btn: { backgroundColor: '#000', padding: 12, borderRadius: 8, width: '80%' },
  btnText: { color: '#fff', textAlign: 'center' },
  link: { marginTop: 15, color: '#333' },
});