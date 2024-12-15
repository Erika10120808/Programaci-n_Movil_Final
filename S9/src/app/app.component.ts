import { Component } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { SqliteService } from './services/sqlite.service';
import { Router } from '@angular/router';
import { CartService } from './services/cart.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { CapacitorSQLite } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public isWeb: boolean;
  public load: boolean;
  public carrito: any;

  constructor(
    private menuCtrl: MenuController,
    private platform: Platform,
    private sqlite: SqliteService,
    private router: Router,
    private cartService: CartService
  ) {
    this.isWeb = false;
    this.load = false;
    this.initApp();
    this.cartService.carrito$.subscribe((items) => {
      this.carrito = items;
    });
  }

  async initApp() {
    this.platform.ready().then(async () => {
      const info = await Device.getInfo();
      this.isWeb = info.platform === 'web';
  
      if (this.isWeb) {
        const sqlite = CapacitorSQLite;
        await sqlite.initWebStore();
      }
  
      this.sqlite.init();
      this.sqlite.dbReady.subscribe(load => {
        this.load = load;
      });
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
    this.menuCtrl.close();
  }

  goToPrincipal() {
    this.router.navigate(['/principal']);
    this.menuCtrl.close();
  }

  irAlCarrito() {
    this.router.navigate(['/carrito'], { state: { carrito: this.carrito } });
    this.menuCtrl.close();
  }


  async openCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      console.log('Foto capturada:', image.webPath);
      alert(`Foto capturada: ${image.webPath}`);
    } catch (error) {
      console.error('Error al abrir la cámara', error);
    }
  }

  
  async getLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Ubicación actual:', coordinates);
      alert(`Latitud: ${coordinates.coords.latitude}, Longitud: ${coordinates.coords.longitude}`);
    } catch (error) {
      console.error('Error al obtener la ubicación', error);
    }
  }
}
