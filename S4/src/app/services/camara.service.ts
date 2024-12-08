import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class CamaraService {
  private readonly baseUrl = 'https://api.jikan.https://ionicframework.com/docs/native/camera /v4'; 

  constructor() {}

 
  async searchMangaDescriptions(query: string): Promise<string[]> {
    const options: HttpOptions = {
      url: `${this.baseUrl}/manga`, 
      params: { q: query, sfw: 'true' }, 
    };

    try {
      const response: HttpResponse = await CapacitorHttp.get(options);
      if (response.status === 200) {
        const mangas = response.data.data;
        return mangas.map((manga: any) => manga.synopsis || 'Sin descripción disponible');
      } else {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
    } catch (error) {
      console.error('Error al buscar mangas:', error);
      throw error;
    }
  }
}

