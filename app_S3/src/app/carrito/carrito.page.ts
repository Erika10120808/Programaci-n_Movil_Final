import { Component } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage {
  items = [
    { codigo: 'M001', nombre: 'Manga One Piece', valor: 15000, cantidad: 1 , totalValor: 15000},
    { codigo: 'F002', nombre: 'Figura Naruto', valor: 45000, cantidad: 1 , totalValor: 45000},
    { codigo: 'P003', nombre: 'Polera Attack on Titan', valor: 20000, cantidad: 1, totalValor: 2000 },
    { codigo: 'T004', nombre: 'Tazón Dragon Ball', valor: 10000, cantidad: 1, totalValor: 10000 },
  ];

  constructor() {}

  aumentarCantidad(item: any) {
    item.cantidad++;
  }

  disminuirCantidad(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
    }
  }

  eliminarItem(codigo: string) {
    this.items = this.items.filter(i => i.codigo !== codigo);
  }
}
