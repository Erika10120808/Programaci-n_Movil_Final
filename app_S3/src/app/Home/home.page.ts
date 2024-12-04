import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  nivelEducacional: string = '';
  fechaNacimiento: Date | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController
  ) {
    this.route.queryParams.subscribe(() => {
      const state = this.router.getCurrentNavigation()?.extras.state;
      if (state && state['email']) {
        this.email = state['email'];
      }
    });
  }

  ngOnInit() {}

  async goToInicio() {
    if (this.nombre && this.apellido && this.nivelEducacional && this.fechaNacimiento) {
      this.router.navigate(['/principal']);
    } else {
      await this.showAlert('Campos incompletos', 'Por favor, completa todos los campos antes de continuar.');
    }
  }

  clearForm() {
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacional = '';
    this.fechaNacimiento = null;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
