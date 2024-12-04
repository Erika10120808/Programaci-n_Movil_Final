import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  public dbReady: BehaviorSubject<boolean>;
  public isWeb: boolean;
  public dbName: string;

  constructor(private http: HttpClient) {
    this.dbReady = new BehaviorSubject(false);
    this.isWeb = false;
    this.dbName = '';
  }

  async init() {
    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if (info.platform === 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        console.error('Esta app necesita permisos para funcionar');
      }
    } else if (info.platform === 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();
    }

    await this.setupDatabase();
  }

  async setupDatabase() {
    const dbSetup = await Preferences.get({ key: 'first_setup_key' });

    if (!dbSetup.value) {
      await this.downloadDatabase();
    } else {
      this.dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName });

      const tables = await CapacitorSQLite.query({
        database: this.dbName,
        statement: "SELECT name FROM sqlite_master WHERE type='table';",
      });
      const tableNames = tables.values ? tables.values.map((table: any) => table.name) : [];

      if (!tableNames.includes('usuarios')) {
        await this.createUsuariosTable();
      }

      this.dbReady.next(true);
    }
  }

  async downloadDatabase() {
    try {
      const jsonExport = await this.http.get<{ database: string }>('assets/db/db.json').toPromise();

      const jsonstring = JSON.stringify(jsonExport);
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

      if (isValid.result) {
        if (jsonExport) {
          this.dbName = jsonExport.database;
        } else {
          throw new Error('jsonExport is undefined');
        }
        await CapacitorSQLite.importFromJson({ jsonstring });
        await CapacitorSQLite.createConnection({ database: this.dbName });
        await CapacitorSQLite.open({ database: this.dbName });

        await Preferences.set({ key: 'first_setup_key', value: '1' });
        await Preferences.set({ key: 'dbname', value: this.dbName });

        this.dbReady.next(true);
      }
    } catch (error) {
      console.error('Error al descargar la base de datos:', error);
    }
  }

  async getDbName() {
    if (!this.dbName) {
      const dbname = await Preferences.get({ key: 'dbname' });
      if (dbname.value) {
        this.dbName = dbname.value;
      }
    }
    return this.dbName;
  }

  async createUsuariosTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        nivel_educacional TEXT NOT NULL,
        fecha_nacimiento TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `;
    await CapacitorSQLite.execute({
      database: this.dbName,
      statements: createTableSQL,
    });
  }

  async create(table: string, fields: string[], values: any[]) {
    const placeholders = fields.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
    const dbName = await this.getDbName();

    try {
      const changes = await CapacitorSQLite.executeSet({
        database: dbName,
        set: [
          {
            statement: sql,
            values: values,
          },
        ],
      });

      if (this.isWeb) {
        await CapacitorSQLite.saveToStore({ database: dbName });
      }

      return changes;
    } catch (error) {
      console.error('Error al insertar en la tabla:', table, 'Error:', error);
      throw error;
    }
  }

  async query(table: string, column: string, value: any): Promise<any[]> {
    const sql = `SELECT * FROM ${table} WHERE ${column} = ?`;
    const dbName = await this.getDbName();

    try {
      const result = await CapacitorSQLite.query({
        database: dbName,
        statement: sql,
        values: [value],
      });
      return result.values || [];
    } catch (error) {
      console.error('Error al realizar consulta:', error);
      throw error;
    }
  }

  async setPreference(key: string, value: string) {
    await Preferences.set({ key, value });
  }

  async getPreference(key: string): Promise<string | null> {
    const result = await Preferences.get({ key });
    return result.value;
  }

  async removePreference(key: string) {
    await Preferences.remove({ key });
  }
  async validateUser(email: string, password: string): Promise<boolean> {
    const sql = `SELECT * FROM usuarios WHERE email = ? AND password = ?`;
    const dbName = await this.getDbName();
  
    try {
      const result = await CapacitorSQLite.query({
        database: dbName,
        statement: sql,
        values: [email, password],
      });
  
      // Verifica si el resultado contiene usuarios
      return result.values !== undefined && result.values.length > 0;
    } catch (error) {
      console.error('Error al validar usuario:', error);
      throw error;
    }
  }
  
}
