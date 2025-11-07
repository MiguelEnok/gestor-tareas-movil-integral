import { updateDoc } from 'firebase/firestore';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db, deleteDoc, doc } from '../screens/firebaseConfig';

export default function TaskItem({ item }) {
  const isCompleted = item.completada;

  const deleteTask = async () => {
    try {
      // Eliminar el documento de la colección 'tasks' en Firestore
      await deleteDoc(doc(db, 'tasks', item.id));
    } catch (error) {
      console.error("Error al eliminar la tarea: ", error);
      alert("No se pudo eliminar la tarea. Inténtalo de nuevo.");
    }
  };

  const markTaskAsCompleted = async () => {
    try {
      await updateDoc(doc(db, 'tasks', item.id), { completada: true });
    } catch (error) {
      console.error("Error al eliminar la tarea: ", error);
      alert("No se pudo eliminar la tarea. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{item.text}</Text>
      <TouchableOpacity onPress={markTaskAsCompleted} 
        style={ isCompleted ? styles.markedButton : styles.unMarkedButton      
        }>
        <Text style={{ color: '#fff', fontSize: 20 }}>√</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteTask} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#ff4d4d',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  unMarkedButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#dadadaff',
    marginLeft: 'auto',

  },

  markedButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#64b2c4ff',
    marginLeft: 'auto',
  },
});