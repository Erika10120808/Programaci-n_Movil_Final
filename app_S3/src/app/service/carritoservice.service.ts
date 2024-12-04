import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private itemsCarrito: any[] = [];

  agregarAlCarrito(item: any) {
    const itemExistente = this.itemsCarrito.find(i => i.codigo === item.codigo);
    if (itemExistente) {
      itemExistente.cantidad += item.cantidad; 
    } else {
      this.itemsCarrito.push(item);
    }
  }

  obtenerItems() {
    return this.itemsCarrito;
  }

  actualizarCantidad(codigo: string, cantidad: number) {
    const item = this.itemsCarrito.find(i => i.codigo === codigo);
    if (item) {
      item.cantidad = cantidad;
    }
  }

  eliminarItem(codigo: string) {
    this.itemsCarrito = this.itemsCarrito.filter(i => i.codigo !== codigo);
  }

  limpiarCarrito() {
    this.itemsCarrito = [];
  }
}

