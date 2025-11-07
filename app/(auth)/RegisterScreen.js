// app/(auth)/RegisterScreen.js
import { auth, createUserWithEmailAndPassword } from '@/screens/firebaseConfig';
import { useRouter } from 'expo-router'; // Importar useRouter
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Inicializar router

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* ... (el resto del JSX es el mismo) */}
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput style={styles.input} placeholder="Correo" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry onChangeText={setPassword} />

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Usar router.replace o router.push para navegar a la pantalla de Login */}
      <TouchableOpacity onPress={() => router.replace('/(auth)/LoginScreen')}> 
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ...StyleSheet.flatten({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 26, color: '#000', marginBottom: 20 },
    input: { width: '80%', padding: 10, borderBottomWidth: 1, borderColor: '#000', marginBottom: 15 },
    btn: { backgroundColor: '#000', padding: 12, borderRadius: 8, width: '80%' },
    btnText: { color: '#fff', textAlign: 'center' },
    link: { marginTop: 15, color: '#333' },
  }),
});
