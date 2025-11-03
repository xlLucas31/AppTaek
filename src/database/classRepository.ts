import { executeSql } from './client';
import { CreateClassInput, TrainingClassRecord } from './types';

const mapRowToClass = (row: any): TrainingClassRecord => ({
  id: row.id,
  title: row.title,
  description: row.description ?? null,
  classDate: row.class_date,
  trainings: row.trainings ? JSON.parse(row.trainings) : [],
  createdAt: row.created_at,
});

export const listClasses = async (): Promise<TrainingClassRecord[]> => {
  const result = await executeSql(
    'SELECT id, title, description, class_date, trainings, created_at FROM classes ORDER BY class_date DESC, id DESC;'
  );
  const rows = result.rows as any;
  return rows._array.map(mapRowToClass);
};

export const createClass = async (input: CreateClassInput): Promise<void> => {
  const trainings = JSON.stringify(input.trainings ?? []);
  await executeSql(
    `INSERT INTO classes (title, description, class_date, trainings) VALUES (?, ?, ?, ?);`,
    [
      input.title.trim(),
      input.description?.trim() ?? null,
      input.classDate,
      trainings,
    ]
  );
};
