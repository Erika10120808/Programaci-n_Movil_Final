import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  nivelEducacional: string = '';
  fechaNacimiento: string = '';
  password: string = '';

  constructor(
    private sqlite: SqliteService,
    private router: Router,
    private alertController: AlertController
  ) {}

  isFormValid(): boolean {
    return (
      this.email.trim() !== '' &&
      this.nombre.trim() !== '' &&
      this.apellido.trim() !== '' &&
      String(this.password).trim() !== '' &&
      this.isValidEmail(this.email) &&
      this.isValidPassword(this.password)
    );
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  isValidPassword(password: string | number): boolean {
    const passwordPattern = /^\d{4}$/;
    return passwordPattern.test(String(password));
  }

  async registrarUsuario() {
    if (!this.isFormValid()) {
      await this.showAlert('Campos incompletos', 'Por favor, completa todos los campos obligatorios antes de continuar.');
      return;
    }

    const usuario = {
      email: this.email,
      nombre: this.nombre,
      apellido: this.apellido,
      nivelEducacional: this.nivelEducacional || null,
      fechaNacimiento: this.fechaNacimiento || null,
      password: String(this.password),
    };

    try {
      const result = await this.sqlite.create(
        'usuarios',
        ['email', 'nombre', 'apellido', 'nivel_educacional', 'fecha_nacimiento', 'password'],
        [
          usuario.email,
          usuario.nombre,
          usuario.apellido,
          usuario.nivelEducacional,
          usuario.fechaNacimiento,
          usuario.password
        ]
      );
      console.log('Usuario registrado:', result);

      await this.showAlert('Éxito', 'Usuario registrado correctamente.');
      this.clearForm();
      this.goToLogin();
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      await this.showAlert('Error', 'No se pudo registrar el usuario. Verifica tus datos o intenta nuevamente.');
    }
  }

  clearForm() {
    this.email = '';
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacional = '';
    this.fechaNacimiento = '';
    this.password = '';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
