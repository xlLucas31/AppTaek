import * as SQLite from 'expo-sqlite/legacy';

const database = SQLite.openDatabase('taekwondo.db');

export const initializeDatabase = (): Promise<void> =>
  new Promise((resolve, reject) => {
    database.transaction(
      (tx) => {
        tx.executeSql('PRAGMA foreign_keys = ON;');
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            class_date TEXT NOT NULL,
            trainings TEXT DEFAULT '[]',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );`
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            belt TEXT,
            notes TEXT,
            joined_at TEXT DEFAULT CURRENT_TIMESTAMP
          );`
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            present INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            UNIQUE(class_id, student_id)
          );`
        );
      },
      (error) => {
        reject(error);
        return true;
      },
      () => resolve()
    );
  });

export const executeSql = (
  sql: string,
  params: unknown[] = []
): Promise<SQLite.SQLResultSet> =>
  new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });

export default database;
