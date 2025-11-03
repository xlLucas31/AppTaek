export interface TrainingClassRecord {
  id: number;
  title: string;
  description: string | null;
  classDate: string;
  trainings: string[];
  createdAt: string;
}

export interface CreateClassInput {
  title: string;
  description?: string;
  classDate: string;
  trainings: string[];
}

export interface StudentRecord {
  id: number;
  fullName: string;
  belt: string | null;
  notes: string | null;
  joinedAt: string;
}

export interface CreateStudentInput {
  fullName: string;
  belt?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: number;
  classId: number;
  studentId: number;
  present: boolean;
  updatedAt: string;
}

export interface AttendanceWithStudent {
  student: StudentRecord;
  present: boolean;
}
