import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss']
})
export class PrincipalPage {
  
  animeItems = [
    { nombre: 'Figura de Naruto', codigo: 'AN001', valor: 15000, cantidad: 1, seleccionado: false },
    { nombre: 'Póster de One Piece', codigo: 'AN002', valor: 5000, cantidad: 1, seleccionado: false },
    { nombre: 'Camiseta de Attack on Titan', codigo: 'AN003', valor: 12000, cantidad: 1, seleccionado: false },
    { nombre: 'Taza de My Hero Academia', codigo: 'AN004', valor: 8000, cantidad: 1, seleccionado: false },
    { nombre: 'Llaveros de Demon Slayer', codigo: 'AN005', valor: 3000, cantidad: 1, seleccionado: false }
  ];

  
  carrito: any[] = [];

  constructor(private router: Router) {}

  
  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

 
  agregarAlCarrito() {
    const seleccionados = this.animeItems.filter(item => item.seleccionado);
    this.carrito.push(...seleccionados);
    console.log('Artículos agregados al carrito:', seleccionados);
  }
}
