import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { initializeDatabase } from './src/database/client';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import AttendanceScreen from './src/screens/AttendanceScreen';
import ClassesScreen from './src/screens/ClassesScreen';
import StudentsScreen from './src/screens/StudentsScreen';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase()
      .then(() => setIsReady(true))
      .catch((err) => {
        console.error('Error initializing database', err);
        setError('No pudimos preparar la base de datos.');
      });
  }, []);

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Cargando aplicación de Taekwondo...</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="light-content" />
      <DrawerNavigator
        initialKey="classes"
        appTitle="Taekwondo Dojang"
        screens={[
          { key: 'classes', title: 'Clases', component: ClassesScreen },
          { key: 'students', title: 'Alumnos', component: StudentsScreen },
          { key: 'attendance', title: 'Asistencia', component: AttendanceScreen },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#f9fafb',
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    color: '#f87171',
    textAlign: 'center',
  },
});
