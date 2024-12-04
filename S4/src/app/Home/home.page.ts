import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  nivelEducacional: string = '';
  fechaNacimiento: Date | null = null;
  password: string = '';

  constructor(
    private sqlite: SqliteService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async registrarUsuario() {
    if (!this.email || !this.nombre || !this.apellido || !this.nivelEducacional || !this.fechaNacimiento || !this.password) {
      await this.showAlert('Campos incompletos', 'Por favor, completa todos los campos antes de continuar.');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      await this.showAlert('Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    const passwordPattern = /^\d{4}$/;
    if (!passwordPattern.test(this.password)) {
      await this.showAlert('Error', 'La contraseña debe tener exactamente 4 dígitos numéricos.');
      return;
    }

    const usuario = {
      email: this.email,
      nombre: this.nombre,
      apellido: this.apellido,
      nivelEducacional: this.nivelEducacional,
      fechaNacimiento: this.fechaNacimiento.toISOString().split('T')[0],
      password: this.password,
    };

    try {
      const result = await this.sqlite.create(
        'usuarios',
        ['email', 'nombre', 'apellido', 'nivel_educacional', 'fecha_nacimiento', 'password'],
        [usuario.email, usuario.nombre, usuario.apellido, usuario.nivelEducacional, usuario.fechaNacimiento, usuario.password]
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
    this.fechaNacimiento = null;
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
