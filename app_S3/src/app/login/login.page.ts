import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  async onLogin() {
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      await this.showAlert('Error', 'Por favor, introduce un correo electrónico válido.');
    } else if (this.password.length !== 4) {
      await this.showAlert('Error', 'La contraseña debe tener exactamente 4 dígitos.');
    } else {
      await this.showAlert('Éxito', 'Inicio de sesión exitoso');
      this.router.navigate(['/principal']); 
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
