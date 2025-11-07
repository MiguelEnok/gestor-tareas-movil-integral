import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  getReactNativePersistence // Necesario solo si no estamos en web
  ,


  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { Platform } from 'react-native'; // Para diferenciar entre web y móvil

// Configuración de Firebase (usando tus datos originales)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
};

// Inicializa Firebase App
const app = initializeApp(firebaseConfig);
let authInstance;

// Inicialización condicional de Auth con persistencia
if (Platform.OS === 'web') {
    authInstance = getAuth(app); // Web usa persistencia de LocalStorage por defecto
} else {
    try {
        // En React Native, forzamos la persistencia de AsyncStorage
        authInstance = initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage)
        });
    } catch (e) {
        // En caso de que falle o ya esté inicializada (como en Hot Reloading)
        console.warn("Auth ya inicializada o error de persistencia:", e);
        authInstance = getAuth(app);
    }
}

const db = getFirestore(app);

// Exportar servicios y funciones requeridas
export {
  addDoc, authInstance as auth, collection, createUserWithEmailAndPassword, db, deleteDoc,
  doc, onAuthStateChanged, onSnapshot, query, signInWithEmailAndPassword, signOut
};

