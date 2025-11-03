import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import EmptyState from '../components/EmptyState';
import { getAttendanceForClass, setAttendanceStatus } from '../database/attendanceRepository';
import { listClasses } from '../database/classRepository';
import { AttendanceWithStudent, TrainingClassRecord } from '../database/types';
import { DrawerScreenComponentProps } from '../navigation/DrawerNavigator';

const AttendanceScreen = ({ onOpenDrawer }: DrawerScreenComponentProps) => {
  const [classes, setClasses] = useState<TrainingClassRecord[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const classData = await listClasses();
      setClasses(classData);
      if (classData.length > 0 && !selectedClassId) {
        setSelectedClassId(classData[0].id);
      }
    } catch (err) {
      console.error('Error loading classes for attendance', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const loadAttendance = async (classId: number) => {
    try {
      const records = await getAttendanceForClass(classId);
      setAttendance(records);
    } catch (err) {
      console.error('Error loading attendance', err);
    }
  };

  useEffect(() => {
    if (selectedClassId != null) {
      loadAttendance(selectedClassId);
    }
  }, [selectedClassId]);

  const activeClass = useMemo(
    () => classes.find((item) => item.id === selectedClassId) ?? null,
    [classes, selectedClassId]
  );

  const toggleAttendance = async (studentId: number, present: boolean) => {
    if (!selectedClassId) {
      return;
    }

    try {
      await setAttendanceStatus(selectedClassId, studentId, present);
      setMessage('Asistencia actualizada');
      await loadAttendance(selectedClassId);
    } catch (err) {
      console.error('Error updating attendance', err);
      setMessage('No pudimos guardar la asistencia.');
    }
  };

  const hasStudents = attendance.length > 0;

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <View style={styles.container}>
      <AppHeader title="Asistencia" onMenuPress={onOpenDrawer} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Selecciona una clase</Text>
          <Text style={styles.sectionSubtitle}>
            Marca la asistencia de tus alumnos para cada clase programada.
          </Text>
        </View>

        {classes.length === 0 ? (
          <EmptyState
            title="No hay clases programadas"
            description="Crea clases desde la sección Clases para poder tomar asistencia."
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.classSelector}
          >
            {classes.map((classItem) => {
              const isActive = classItem.id === selectedClassId;
              return (
                <Pressable
                  key={classItem.id}
                  style={[styles.classChip, isActive && styles.classChipActive]}
                  onPress={() => setSelectedClassId(classItem.id)}
                >
                  <Text style={[styles.classChipTitle, isActive && styles.classChipTitleActive]}>
                    {classItem.title}
                  </Text>
                  <Text style={[styles.classChipDate, isActive && styles.classChipDateActive]}>
                    {new Date(classItem.classDate).toLocaleDateString()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {activeClass ? (
          <View style={styles.activeClassCard}>
            <Text style={styles.activeClassTitle}>{activeClass.title}</Text>
            <Text style={styles.activeClassDate}>
              {new Date(activeClass.classDate).toLocaleDateString()}
            </Text>
            {activeClass.description ? (
              <Text style={styles.activeClassDescription}>{activeClass.description}</Text>
            ) : null}
            <View style={styles.trainingBadgeGroup}>
              {activeClass.trainings.map((training) => (
                <View key={training} style={styles.trainingBadge}>
                  <Text style={styles.trainingBadgeText}>{training}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {selectedClassId && hasStudents ? (
          <View style={styles.attendanceList}>
            {attendance.map(({ student, present }) => (
              <View key={student.id} style={styles.attendanceItem}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.fullName}</Text>
                  {student.belt ? (
                    <Text style={styles.studentBelt}>{student.belt}</Text>
                  ) : null}
                </View>
                <Switch
                  value={present}
                  onValueChange={(value) => toggleAttendance(student.id, value)}
                  thumbColor={present ? '#047857' : undefined}
                  trackColor={{ true: '#34d399', false: '#d1d5db' }}
                />
              </View>
            ))}
          </View>
        ) : null}

        {selectedClassId && !loading && !hasStudents ? (
          <EmptyState
            title="Agrega alumnos"
            description="Todavía no hay alumnos para tomar asistencia. Ve a la sección Alumnos para crear algunos registros."
          />
        ) : null}

        {message ? <Text style={styles.messageText}>{message}</Text> : null}
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
  sectionHeader: {
    marginBottom: 16,
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
  classSelector: {
    gap: 12,
    paddingBottom: 12,
  },
  classChip: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 12,
  },
  classChipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1e40af',
  },
  classChipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  classChipTitleActive: {
    color: '#ffffff',
  },
  classChipDate: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  classChipDateActive: {
    color: '#e0e7ff',
  },
  activeClassCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  activeClassTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  activeClassDate: {
    marginTop: 4,
    color: '#2563eb',
    fontWeight: '600',
  },
  activeClassDescription: {
    marginTop: 10,
    color: '#4b5563',
  },
  trainingBadgeGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  trainingBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  trainingBadgeText: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  attendanceList: {
    gap: 12,
    marginBottom: 24,
  },
  attendanceItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  studentBelt: {
    marginTop: 4,
    color: '#2563eb',
  },
  messageText: {
    textAlign: 'center',
    color: '#047857',
    fontWeight: '600',
    marginTop: 12,
  },
});

export default AttendanceScreen;
