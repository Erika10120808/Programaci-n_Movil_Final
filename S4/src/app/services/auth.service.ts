import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private sqliteService: SqliteService) {
    this.checkAuth();
  }

  /**
   * Verifica si el usuario ya está autenticado mediante las preferencias almacenadas.
   */
  private async checkAuth() {
    const email = await this.sqliteService.getPreference('userEmail');
    const password = await this.sqliteService.getPreference('userPassword');

    if (email && password) {
      const users = await this.sqliteService.query('usuarios', 'email', email);
      if (users.length > 0 && users[0].password === password) {
        this.isAuthenticatedSubject.next(true);
      } else {
        this.isAuthenticatedSubject.next(false);
      }
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  /**
   * Inicia sesión verificando las credenciales del usuario.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Promesa que resuelve en true si las credenciales son válidas, de lo contrario false.
   */
  async login(email: string, password: string): Promise<boolean> {
    const users = await this.sqliteService.query('usuarios', 'email', email);

    if (users.length > 0 && users[0].password === password) {
      await this.sqliteService.setPreference('userEmail', email);
      await this.sqliteService.setPreference('userPassword', password);
      this.isAuthenticatedSubject.next(true);
      return true;
    }

    this.isAuthenticatedSubject.next(false);
    return false;
  }

  /**
   * Cierra la sesión del usuario y limpia las preferencias almacenadas.
   */
  logout() {
    this.sqliteService.removePreference('userEmail');
    this.sqliteService.removePreference('userPassword');
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Devuelve un observable del estado de autenticación del usuario.
   */
  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
