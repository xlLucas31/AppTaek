declare module 'expo-sqlite/legacy' {
  export interface SQLResultSetRowList {
    length: number;
    item: (index: number) => any;
    _array: any[];
  }

  export interface SQLResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: SQLResultSetRowList;
  }

  export interface SQLTransaction {
    executeSql(
      sqlStatement: string,
      args?: any[] | null,
      callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
      errorCallback?: (transaction: SQLTransaction, error: any) => boolean
    ): void;
  }

  export interface WebSQLDatabase {
    transaction(
      callback: (transaction: SQLTransaction) => void,
      errorCallback?: (error: any) => void,
      successCallback?: () => void
    ): void;
  }

  export function openDatabase(
    name?: string,
    version?: string,
    displayName?: string,
    size?: number
  ): WebSQLDatabase;
}
