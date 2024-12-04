import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage {
  items: any[] = []; 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController
  ) {
    
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
    if (state && state['carrito']) {
      this.items = state['carrito'];
    }
  }

  aumentarCantidad(item: any) {
    item.cantidad++;
    item.totalValor = item.cantidad * item.valor;
  }

  disminuirCantidad(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
      item.totalValor = item.cantidad * item.valor;
    }
  }

  eliminarItem(codigo: string) {
    this.items = this.items.filter((i) => i.codigo !== codigo);
  }

  goToPrincipal() {
    this.router.navigate(['/principal']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}