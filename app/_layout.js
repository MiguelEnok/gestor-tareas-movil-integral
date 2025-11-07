import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

// ⚠️ Asegúrate de que las rutas sean correctas. 
// Aquí estoy usando alias '@/' para hooks y screens/firebaseConfig
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth, onAuthStateChanged } from '@/screens/firebaseConfig';
import SplashScreen from '@/screens/SplashScreen';

export const unstable_settings = {
  // Aquí puedes poner tu ruta de inicio, por ejemplo, el grupo (auth) si quieres forzar el login
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo necesitamos suscribirnos al estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Mostrar Splash Screen mientras carga la autenticación
  if (loading) {
    return <SplashScreen/>;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> 
        
        {user ? (
          // Rutas de la aplicación principal (debe tener un index o un _layout)
          <Stack.Screen name="(app)" options={{ headerShown: false }} /> 
        ) : (
          // Rutas de autenticación
          <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}