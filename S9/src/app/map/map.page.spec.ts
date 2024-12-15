import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapPage } from './map.page';
import { Geolocation } from '@capacitor/geolocation';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GoogleMapsModule } from '@angular/google-maps';

describe('MapPage', () => {
    let component: MapPage;
    let fixture: ComponentFixture<MapPage>;
    let geolocationSpy: any;

    beforeEach(async () => {
        (window as any).google = {
            maps: {
                Map: class {
                    constructor() {}
                    setCenter() {}
                    setZoom() {}
                },
                Marker: class {
                    constructor() {}
                    setMap() {}
                    setPosition() {}
                },
                LatLng: class {
                    constructor(lat: number, lng: number) {
                        return { lat, lng };
                    }
                },
                MapTypeId: { ROADMAP: 'roadmap' },
                Animation: { DROP: 1 }
            }
        };

        geolocationSpy = {
            getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.returnValue(
                Promise.resolve({
                    coords: {
                        latitude: -33.4489,
                        longitude: -70.6693,
                        accuracy: 0,
                        altitudeAccuracy: null,
                        altitude: null,
                        speed: null,
                        heading: null
                    },
                    timestamp: 0
                })
            ),
            watchPosition: jasmine.createSpy('watchPosition').and.returnValue(
                Promise.resolve('watchId123')
            ),
            clearWatch: jasmine.createSpy('clearWatch').and.returnValue(
                Promise.resolve()
            )
        };

        spyOn(Geolocation, 'getCurrentPosition').and.callFake(geolocationSpy.getCurrentPosition);
        spyOn(Geolocation, 'watchPosition').and.callFake(geolocationSpy.watchPosition);
        spyOn(Geolocation, 'clearWatch').and.callFake(geolocationSpy.clearWatch);

        await TestBed.configureTestingModule({
            imports: [
                IonicModule.forRoot(),
                GoogleMapsModule,
                MapPage
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(MapPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});