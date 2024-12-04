import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage {
  animeItems = [
    { nombre: 'Figura de Naruto', codigo: 'AN001', valor: 15000, seleccionado: false },
    { nombre: 'Póster de One Piece', codigo: 'AN002', valor: 5000, seleccionado: false },
    { nombre: 'Camiseta de Attack on Titan', codigo: 'AN003', valor: 12000, seleccionado: false },
    { nombre: 'Taza de My Hero Academia', codigo: 'AN004', valor: 8000, seleccionado: false },
    { nombre: 'Llaveros de Demon Slayer', codigo: 'AN005', valor: 3000, seleccionado: false },
  ];

  carrito: any[] = [];
  searchQuery: string = '';
  mangaDescriptions: string[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async agregarAlCarrito() {
    const seleccionados = this.animeItems.filter((item) => item.seleccionado);
    if (seleccionados.length > 0) {
      this.carrito.push(...seleccionados);
      const toast = await this.toastCtrl.create({
        message: 'Artículos agregados al carrito.',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Selecciona al menos un artículo.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  irAlCarrito() {
    this.router.navigate(['/carrito'], { state: { carrito: this.carrito } });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async buscarManga() {
    if (!this.searchQuery.trim()) {
      alert('Por favor, introduce un término de búsqueda.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Buscando mangas...',
      spinner: 'crescent',
    });
    await loading.present();

    const apiUrl = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(this.searchQuery)}`;
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        loading.dismiss();
        if (response.data && response.data.length > 0) {
          this.mangaDescriptions = response.data.map((manga: any) => manga.synopsis || 'Descripción no disponible');
        } else {
          this.mangaDescriptions = [];
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al buscar mangas:', err);
        alert('Hubo un error al conectar con el servidor. Por favor, inténtalo nuevamente.');
      },
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.mangaDescriptions = [];
  }
}
