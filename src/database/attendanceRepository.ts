import { executeSql } from './client';
import { AttendanceWithStudent } from './types';

export const getAttendanceForClass = async (
  classId: number
): Promise<AttendanceWithStudent[]> => {
  const result = await executeSql(
    `SELECT s.id as student_id, s.full_name, s.belt, s.notes, s.joined_at, 
            COALESCE(a.present, 0) as present
       FROM students s
       LEFT JOIN attendance a ON a.student_id = s.id AND a.class_id = ?
       ORDER BY s.full_name COLLATE NOCASE;`,
    [classId]
  );
  const rows = result.rows as any;
  return rows._array.map((row: any) => ({
    student: {
      id: row.student_id,
      fullName: row.full_name,
      belt: row.belt ?? null,
      notes: row.notes ?? null,
      joinedAt: row.joined_at,
    },
    present: Boolean(row.present),
  }));
};

export const setAttendanceStatus = async (
  classId: number,
  studentId: number,
  present: boolean
): Promise<void> => {
  await executeSql(
    `INSERT INTO attendance (class_id, student_id, present, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(class_id, student_id) DO UPDATE SET
       present = excluded.present,
       updated_at = CURRENT_TIMESTAMP;`,
    [classId, studentId, present ? 1 : 0]
  );
};
