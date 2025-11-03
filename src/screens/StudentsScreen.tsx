import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import { createStudent, listStudents } from '../database/studentRepository';
import { StudentRecord } from '../database/types';
import { DrawerScreenComponentProps } from '../navigation/DrawerNavigator';

interface StudentFormState {
  fullName: string;
  belt: string;
  notes: string;
}

const initialFormState: StudentFormState = {
  fullName: '',
  belt: '',
  notes: '',
};

const StudentsScreen = ({ onOpenDrawer }: DrawerScreenComponentProps) => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [form, setForm] = useState<StudentFormState>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await listStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      console.error('Error loading students', err);
      setError('No pudimos cargar los alumnos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) {
      setError('El nombre del alumno es obligatorio.');
      return;
    }

    try {
      await createStudent({
        fullName: form.fullName,
        belt: form.belt,
        notes: form.notes,
      });
      setSuccessMessage('Alumno guardado.');
      resetForm();
      await loadStudents();
    } catch (err) {
      console.error('Error saving student', err);
      setError('No pudimos guardar el alumno.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Alumnos" onMenuPress={onOpenDrawer} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Agregar alumno</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={form.fullName}
            onChangeText={(text) => setForm((prev) => ({ ...prev, fullName: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Graduación / Cinturón"
            value={form.belt}
            onChangeText={(text) => setForm((prev) => ({ ...prev, belt: text }))}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Notas adicionales"
            multiline
            value={form.notes}
            onChangeText={(text) => setForm((prev) => ({ ...prev, notes: text }))}
          />
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar alumno</Text>
          </Pressable>
          {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
          {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Listado</Text>
          <Text style={styles.sectionSubtitle}>
            Gestiona tus alumnos y registra información útil para las clases.
          </Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Cargando alumnos...</Text>
        ) : students.length === 0 ? (
          <EmptyState
            title="Sin alumnos registrados"
            description="Agrega tus primeros alumnos para poder tomar asistencia."
          />
        ) : (
          <View style={styles.studentList}>
            {students.map((student) => (
              <View key={student.id} style={styles.studentCard}>
                <Text style={styles.studentName}>{student.fullName}</Text>
                {student.belt ? <Text style={styles.studentDetail}>Cinturón: {student.belt}</Text> : null}
                {student.notes ? (
                  <Text style={styles.studentNotes}>{student.notes}</Text>
                ) : null}
                <Text style={styles.studentDate}>
                  Ingreso: {new Date(student.joinedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#eff6ff',
    fontWeight: '700',
    fontSize: 16,
  },
  errorMessage: {
    marginTop: 12,
    color: '#dc2626',
  },
  successMessage: {
    marginTop: 12,
    color: '#047857',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    color: '#4b5563',
    marginTop: 4,
  },
  loadingText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 20,
  },
  studentList: {
    gap: 12,
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  studentDetail: {
    marginTop: 6,
    color: '#2563eb',
    fontWeight: '600',
  },
  studentNotes: {
    marginTop: 8,
    color: '#4b5563',
  },
  studentDate: {
    marginTop: 12,
    fontSize: 12,
    color: '#6b7280',
  },
});

export default StudentsScreen;
