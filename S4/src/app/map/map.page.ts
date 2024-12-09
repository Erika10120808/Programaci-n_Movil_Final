import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { Geolocation, Position } from '@capacitor/geolocation';
import { IonicModule } from '@ionic/angular'; 


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [IonicModule, GoogleMapsModule, CommonModule],
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {
  lat: number = 0;
  lng: number = 0;
  watchId: string | null = null;

  async ngOnInit() {
    await this.getCurrentPosition();
    this.watchPosition();
  }

  async getCurrentPosition() {
    try {
      const coordinates: Position = await Geolocation.getCurrentPosition();
      this.lat = coordinates.coords.latitude;
      this.lng = coordinates.coords.longitude;
    } catch (error) {
      console.error('Error obteniendo la posición:', error);
    }
  }

  async watchPosition() {
    try {
      this.watchId = await Geolocation.watchPosition({}, (position, err) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }
        if (err) {
          console.error('Error en la observación de posición:', err);
        }
      });
    } catch (error) {
      console.error('Error al iniciar el watchPosition:', error);
    }
  }

  async ngOnDestroy() {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
    }
  }
}
