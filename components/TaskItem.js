import { updateDoc } from 'firebase/firestore';
import { useState } from 'react'; // 👈 ¡Importar useState!
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db, deleteDoc, doc } from '../screens/firebaseConfig';

export default function TaskItem({ item, uid }) {
  const [isEditing, setIsEditing] = useState(false); // 🟢 Estado para saber si estamos editando
  const [editedText, setEditedText] = useState(item.text); // 🟢 Estado para guardar el texto que se edita
  const isCompleted = item.completada;

  const getTaskRef = () => {
      // ⚠️ Verificar que el UID existe antes de construir la ruta
      if (!uid) return null; 
      // Construir la ruta: 'users/{uid}/tasks/{taskId}'
      return doc(db, 'users', uid, 'tasks', item.id);
  }

 const deleteTask = async () => {
    const taskRef = getTaskRef();
    console.log("Deleting task at ref: ", taskRef);
    if (!taskRef) return;
    
    try {
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error al eliminar la tarea: ", error);
      alert("No se pudo eliminar la tarea. Inténtalo de nuevo.");
    }
  };

  const handleDeleteTask = () => {
    Alert.alert(
      "Confirmar Eliminación",
      `¿Estás seguro de que quieres eliminar la tarea "${item.text}"?`,
      [
        // Botón Cancelar (no hace nada)
        {
          text: "Cancelar",
          style: "cancel"
        },
        // Botón OK (llama a la función de borrado real)
        {
          text: "Sí, Eliminar",
          onPress: deleteTask,
          style: "destructive" // Le da un color rojo al botón en iOS
        }
      ],
      { cancelable: true } // Permite cerrar el diálogo tocando fuera
    );
  };

  const markTaskAsCompleted = async () => {
    const taskRef = getTaskRef();
    if (!taskRef) return;

    try {
      // Alternamos el estado de 'completada'
      await updateDoc(taskRef, { completada: !isCompleted });
    } catch (error) {
      console.error("Error al marcar la tarea: ", error);
      alert("No se pudo actualizar la tarea. Inténtalo de nuevo.");
    }
  };

  const saveEdit = async () => {
    const taskRef = getTaskRef();
    if (!taskRef) return;
    if (editedText.trim() === item.text) {
        // Si el texto no cambió, solo salimos del modo edición
        setIsEditing(false);
        return;
    }
    
    if (!editedText.trim()) {
      // Si el texto está vacío, quizás queramos borrar la tarea o restablecer el texto
      alert('La tarea no puede estar vacía.');
      setEditedText(item.text); // Restablecer al texto original
      setIsEditing(false);
      return;
    }
    
    try {
      // 🚀 Actualizar el documento en Firestore
      await updateDoc(taskRef, { text: editedText });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al editar la tarea: ", error);
      alert("No se pudo guardar la edición. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.taskContainer}>
      {isEditing ? (
        // 🟢 MODO EDICIÓN: Muestra un TextInput
        <TextInput
          style={styles.taskInput}
          value={editedText}
          onChangeText={setEditedText}
          onBlur={saveEdit} // 👈 Guardar al perder el foco (al terminar de escribir)
          autoFocus={true}
        />
      ) : (
        // 🟢 MODO VISUALIZACIÓN: Muestra el Text y permite entrar al modo edición
        <TouchableOpacity 
          style={styles.taskTextWrapper} 
          onPress={() => setIsEditing(true)} // 👈 Entrar en modo edición al hacer clic
        >
          <Text style={[styles.taskText, isCompleted && styles.completedText]}>
            {item.text}
          </Text>
        </TouchableOpacity>
      )}

      {/* Botón de Completado/Desmarcado */}
      <TouchableOpacity 
        onPress={markTaskAsCompleted} 
        style={ isCompleted ? styles.markedButton : styles.unMarkedButton }
      >
        <Text style={{ color: '#fff', fontSize: 20 }}>{isCompleted ? '✓' : ' '}</Text>
      </TouchableOpacity>
      
      {/* Botón de Eliminar */}
      <TouchableOpacity onPress={handleDeleteTask} style={styles.deleteButton}>
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
    padding: 5, // Reducido para mejor espacio
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  // Nuevo estilo para el TextInput en modo edición
  taskInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#333', 
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#aaa'
  },
  taskTextWrapper: { // Envoltura para el TouchableOpacity
    flex: 1,
    padding: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedText: { // Estilo para tachar el texto si está completado
    textDecorationLine: 'line-through',
    color: '#999',
  },
  // ... (otros estilos como deleteButton, markedButton, unMarkedButton)
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
    marginLeft: 10, // Ajustado
  },

  markedButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#64b2c4ff',
    marginLeft: 10, // Ajustado
  },
});