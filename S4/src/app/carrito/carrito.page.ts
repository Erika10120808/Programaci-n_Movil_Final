import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-carrito',
    templateUrl: './carrito.page.html',
    styleUrls: ['./carrito.page.scss'],
    standalone: false
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
      console.log(this.items)
    }
  }

  aumentarCantidad(item: any) {
    console.log("aumentando" +  item)
    console.log("cantidad" +  item['cantidad'])
    console.log("cantidad" +  item.cantidad)
    console.log("totalValor" +  item['totalValor'])
    console.log("totalValor" +  item.totalValor)
    console.log("valor" +  item['valor'])
    console.log("valor" +  item.valor)
    

    item.cantidad++;
    item.totalValor = item.cantidad * item.valor;
  }

  disminuirCantidad(item: any) {
    console.log("disminuirCantidad cantidad" +  item.cantidad)
    if(item.cantidad == 1){
      this.eliminarItem(item.codigo)
    }
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
