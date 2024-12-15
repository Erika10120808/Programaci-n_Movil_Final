import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carrito = new BehaviorSubject<any[]>([]);
  carrito$ = this.carrito.asObservable();

  constructor() {}

  agregarAlCarrito(items: any[]) {
    const carritoActual = this.carrito.value;
    const nuevoCarrito = [...carritoActual, ...items];
    this.carrito.next(nuevoCarrito);
  }

  obtenerCarrito() {
    return this.carrito.value;
  }

  limpiarCarrito() {
    this.carrito.next([]);
  }
}
