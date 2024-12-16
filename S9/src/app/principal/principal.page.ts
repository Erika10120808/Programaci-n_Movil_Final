import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false
})
export class PrincipalPage {
  animeItems = [
    { nombre: 'Figura de Naruto', codigo: 'AN001', valor: 15000, seleccionado: false },
    { nombre: 'Póster de One Piece', codigo: 'AN002', valor: 5000, seleccionado: false },
    { nombre: 'Camiseta de Attack on Titan', codigo: 'AN003', valor: 12000, seleccionado: false },
    { nombre: 'Taza de My Hero Academia', codigo: 'AN004', valor: 8000, seleccionado: false },
    { nombre: 'Llaveros de Demon Slayer', codigo: 'AN005', valor: 3000, seleccionado: false },
  ];

  public carrito: any[] = [];
  searchQuery: string = '';
  mangaDescriptions: string[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private cartService: CartService
  ) {}

  async agregarAlCarrito() {
    const seleccionados = this.animeItems.filter((item) => item.seleccionado);
    if (seleccionados.length > 0) {
      this.carrito.push(...seleccionados);
      this.cartService.agregarAlCarrito(this.carrito);
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

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
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
      alert('No se pudo obtener la ubicación. Inténtalo nuevamente.');
    }
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
