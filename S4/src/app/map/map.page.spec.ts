import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MapPage } from './map.page';
import { IonicModule } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';

describe('MapPage', () => {
  let component: MapPage;
  let fixture: ComponentFixture<MapPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule, GoogleMapsModule, CommonModule],
      declarations: [MapPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get current position on ngOnInit', fakeAsync(async () => {
    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.0060,
      },
    };

    spyOn(Geolocation, 'getCurrentPosition').and.returnValue(Promise.resolve({
      coords: { latitude: 10, longitude: 20 },
    } as any));
    

    await component.ngOnInit();
    tick();

    expect(component.lat).toBe(40.7128);
    expect(component.lng).toBe(-74.0060);
  }));

  it('should handle error if getCurrentPosition fails', fakeAsync(async () => {
    spyOn(Geolocation, 'getCurrentPosition').and.returnValue(Promise.reject('Error en la geolocalización'));

    spyOn(console, 'error');

    await component.getCurrentPosition();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error obteniendo la posición:', 'Error en la geolocalización');
  }));

  it('should watch position and update coordinates', fakeAsync(async () => {
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    };

    spyOn(Geolocation, 'watchPosition').and.callFake((_, callback) => {
      callback({
        coords: {
          latitude: 15,
          longitude: 25,
          accuracy: 10,            
          altitude: null,          
          altitudeAccuracy: null,  
          heading: null,           
          speed: null,             
        },
        timestamp: Date.now(),    
      }, null);
    
      return Promise.resolve('watchId123');
    });
    
    

    await component.watchPosition();
    tick();

    expect(component.lat).toBe(37.7749);
    expect(component.lng).toBe(-122.4194);
    expect(component.watchId).toBe('watchId123');
  }));

  it('should handle error in watchPosition', fakeAsync(async () => {
    spyOn(Geolocation, 'watchPosition').and.callFake((_, callback) => {
      callback(null, 'Error en watchPosition');
      return Promise.resolve('watchId123');
    });

    spyOn(console, 'error');

    await component.watchPosition();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error en la observación de posición:', 'Error en watchPosition');
  }));

  it('should clear watch on ngOnDestroy', fakeAsync(async () => {
    component.watchId = 'watchId123';
    spyOn(Geolocation, 'clearWatch').and.returnValue(Promise.resolve());

    await component.ngOnDestroy();
    tick();

    expect(Geolocation.clearWatch).toHaveBeenCalledWith({ id: 'watchId123' });
  }));
});
