import { executeSql } from './client';
import { CreateStudentInput, StudentRecord } from './types';

const mapRowToStudent = (row: any): StudentRecord => ({
  id: row.id,
  fullName: row.full_name,
  belt: row.belt ?? null,
  notes: row.notes ?? null,
  joinedAt: row.joined_at,
});

export const listStudents = async (): Promise<StudentRecord[]> => {
  const result = await executeSql(
    'SELECT id, full_name, belt, notes, joined_at FROM students ORDER BY full_name COLLATE NOCASE;'
  );
  const rows = result.rows as any;
  return rows._array.map(mapRowToStudent);
};

export const createStudent = async (input: CreateStudentInput): Promise<void> => {
  await executeSql(
    `INSERT INTO students (full_name, belt, notes) VALUES (?, ?, ?);`,
    [input.fullName.trim(), input.belt?.trim() ?? null, input.notes?.trim() ?? null]
  );
};
