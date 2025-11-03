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
import { createClass, listClasses } from '../database/classRepository';
import { TrainingClassRecord } from '../database/types';
import { DrawerScreenComponentProps } from '../navigation/DrawerNavigator';

const todayString = () => new Date().toISOString().split('T')[0];

interface ClassFormState {
  title: string;
  description: string;
  classDate: string;
  trainings: string[];
}

const initialFormState: ClassFormState = {
  title: '',
  description: '',
  classDate: todayString(),
  trainings: [],
};

const ClassesScreen = ({ onOpenDrawer }: DrawerScreenComponentProps) => {
  const [classes, setClasses] = useState<TrainingClassRecord[]>([]);
  const [form, setForm] = useState<ClassFormState>(initialFormState);
  const [trainingDraft, setTrainingDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const data = await listClasses();
      setClasses(data);
      setError(null);
    } catch (err) {
      console.error('Error loading classes', err);
      setError('No pudimos cargar las clases. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const resetForm = () => {
    setForm({ ...initialFormState, classDate: todayString() });
    setTrainingDraft('');
  };

  const handleAddTraining = () => {
    if (!trainingDraft.trim()) {
      return;
    }
    setForm((prev) => ({ ...prev, trainings: [...prev.trainings, trainingDraft.trim()] }));
    setTrainingDraft('');
  };

  const handleRemoveTraining = (training: string) => {
    setForm((prev) => ({
      ...prev,
      trainings: prev.trainings.filter((item) => item !== training),
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('La clase necesita un título.');
      return;
    }

    if (!form.classDate.trim()) {
      setError('Ingresa una fecha para la clase.');
      return;
    }

    try {
      await createClass({
        title: form.title,
        description: form.description,
        classDate: form.classDate,
        trainings: form.trainings,
      });
      setSuccessMessage('Clase guardada correctamente.');
      resetForm();
      await loadClasses();
    } catch (err) {
      console.error('Error saving class', err);
      setError('No pudimos guardar la clase. Intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Clases" onMenuPress={onOpenDrawer} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Crear nueva clase</Text>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={form.title}
            onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha (YYYY-MM-DD)"
            value={form.classDate}
            onChangeText={(text) => setForm((prev) => ({ ...prev, classDate: text }))}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Descripción"
            multiline
            value={form.description}
            onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
          />
          <View style={styles.trainingContainer}>
            <TextInput
              style={[styles.input, styles.trainingInput]}
              placeholder="Agregar entrenamiento (ej: Poomsae 1)"
              value={trainingDraft}
              onChangeText={setTrainingDraft}
            />
            <Pressable style={styles.addTrainingButton} onPress={handleAddTraining}>
              <Text style={styles.addTrainingButtonText}>Agregar</Text>
            </Pressable>
          </View>
          <View style={styles.trainingList}>
            {form.trainings.map((training) => (
              <View key={training} style={styles.trainingChip}>
                <Text style={styles.trainingText}>{training}</Text>
                <Pressable onPress={() => handleRemoveTraining(training)}>
                  <Text style={styles.removeTraining}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar clase</Text>
          </Pressable>
          {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
          {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Clases programadas</Text>
          <Text style={styles.sectionSubtitle}>
            Organiza las clases como notas rápidas con fecha, descripción y lista de
            entrenamientos.
          </Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Cargando clases...</Text>
        ) : classes.length === 0 ? (
          <EmptyState
            title="Aún no tienes clases"
            description="Crea tu primera clase para comenzar a planificar entrenamientos."
          />
        ) : (
          <View style={styles.classesGrid}>
            {classes.map((classItem) => (
              <View key={classItem.id} style={styles.classCard}>
                <Text style={styles.classTitle}>{classItem.title}</Text>
                <Text style={styles.classDate}>
                  {new Date(classItem.classDate).toLocaleDateString()}
                </Text>
                {classItem.description ? (
                  <Text style={styles.classDescription}>{classItem.description}</Text>
                ) : null}
                <View style={styles.divider} />
                <View style={styles.trainingListPreview}>
                  {classItem.trainings.length > 0 ? (
                    classItem.trainings.map((training) => (
                      <Text key={training} style={styles.trainingPreviewItem}>
                        • {training}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.trainingPreviewEmpty}>Sin entrenamientos cargados.</Text>
                  )}
                </View>
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
    paddingBottom: 40,
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
  trainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trainingInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 12,
  },
  addTrainingButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addTrainingButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  trainingList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  trainingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  trainingText: {
    marginRight: 6,
    color: '#1d4ed8',
    fontWeight: '500',
  },
  removeTraining: {
    color: '#1e3a8a',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#047857',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ecfdf5',
    fontWeight: '700',
    fontSize: 16,
  },
  errorMessage: {
    marginTop: 12,
    color: '#dc2626',
    fontSize: 14,
  },
  successMessage: {
    marginTop: 12,
    color: '#047857',
    fontSize: 14,
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
  classesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  classCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400e',
  },
  classDate: {
    fontSize: 14,
    color: '#b45309',
    marginTop: 4,
  },
  classDescription: {
    marginTop: 10,
    color: '#92400e',
  },
  divider: {
    height: 1,
    backgroundColor: '#f59e0b',
    opacity: 0.5,
    marginVertical: 12,
  },
  trainingListPreview: {
    gap: 6,
  },
  trainingPreviewItem: {
    color: '#78350f',
  },
  trainingPreviewEmpty: {
    color: '#a16207',
    fontStyle: 'italic',
  },
});

export default ClassesScreen;
