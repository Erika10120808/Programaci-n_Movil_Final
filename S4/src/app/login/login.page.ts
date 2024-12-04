import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private sqliteService: SqliteService
  ) {}

  async onLogin() {
  
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      await this.showAlert('Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    
    if (!/^\d{4}$/.test(this.password)) {
      await this.showAlert('Error', 'La contraseña debe tener exactamente 4 dígitos.');
      return;
    }

    try {
      
      const isValid = await this.sqliteService.validateUser(this.email, this.password);
      if (isValid) {
        
        this.router.navigate(['/principal'], { state: { email: this.email } });
      } else {
        await this.showAlert('Error', 'Credenciales incorrectas. Por favor, verifica tu email o contraseña.');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      await this.showAlert('Error', 'Hubo un problema al procesar tu solicitud. Intenta nuevamente.');
    }
  }

  onRegister() {
  
    this.router.navigate(['/home']);
  }

  clearForm() {

    this.email = '';
    this.password = '';
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
