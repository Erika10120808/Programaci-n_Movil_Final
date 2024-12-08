import { Component } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { SqliteService } from './services/sqlite.service';
import { Router } from '@angular/router';
import { CartService } from './services/cart.service';





@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isWeb: boolean;
  public load: boolean;
  public carrito:any;
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

      this.sqlite.init();
      this.sqlite.dbReady.subscribe(load => {
        this.load = load;
      })
    })
  }
  goToLogin() {
    this.router.navigate(['/login']);
    this.menuCtrl.close();

  }
  goToPrincipal(){
    this.router.navigate(['/principal']);
    this.menuCtrl.close();
  };
  irAlCarrito() {
    this.router.navigate(['/carrito'], { state: { carrito: this.carrito } });
    this.menuCtrl.close();
  }
}