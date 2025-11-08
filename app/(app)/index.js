import { addDoc, auth, collection, db, onSnapshot, signOut } from '@/screens/firebaseConfig';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TaskItem from '../../components/TaskItem';

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return; // Salir si no hay usuario

    const q = collection(db, 'users', user.uid, 'tasks');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;
    // Opcional: Podrías añadir el uid del usuario para filtrar tareas: { text: task, userId: auth.currentUser.uid }
    await addDoc(collection(db, 'users', user.uid, 'tasks'), { text: task }); 
    setTask('');
  };

  const handleLogout = async () => {
    router.push('/(auth)/LoginScreen');
    await signOut(auth);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Nueva tarea..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={{ color: '#fff', fontSize: 18 }}>＋</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem item={item} uid={user?.uid} />}
      />

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={{ color: '#000' }}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { flex: 1, borderBottomWidth: 1, borderColor: '#000', padding: 10 },
  addBtn: { backgroundColor: '#000', marginLeft: 10, padding: 10, borderRadius: 8 },
  logout: { marginTop: 20, alignSelf: 'center' },
});