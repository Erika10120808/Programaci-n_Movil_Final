import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PrincipalPage } from './principal.page';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoadingController, ToastController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Photo } from '@capacitor/camera';


describe('PrincipalPage', () => {
  let component: PrincipalPage;
  let fixture: ComponentFixture<PrincipalPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['create']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['agregarAlCarrito']);

    await TestBed.configureTestingModule({
      declarations: [PrincipalPage],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: CartService, useValue: cartServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrincipalPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show a toast if no items are selected', fakeAsync(async () => {
    const toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));

    await component.agregarAlCarrito();
    tick();

    expect(toastControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Selecciona al menos un artículo.', color: 'danger' })
    );
    expect(toastSpy.present).toHaveBeenCalled();
  }));

  it('should add selected items to the cart', fakeAsync(async () => {
    component.animeItems[0].seleccionado = true;

    const toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));

    await component.agregarAlCarrito();
    tick();

    expect(cartServiceSpy.agregarAlCarrito).toHaveBeenCalledWith(component.carrito);
    expect(toastSpy.present).toHaveBeenCalled();
  }));

  it('should call Camera.getPhoto on takePicture', fakeAsync(async () => {
    

    const mockImage: Photo = {
      webPath: 'path/to/image.jpg',
      format: 'jpeg',
      saved: true,
      path: 'path/to/image.jpg',
      exif: undefined,
      base64String: undefined,
    };

    spyOn(Camera, 'getPhoto').and.returnValue(Promise.resolve(mockImage));
    spyOn(console, 'log');

    await component.takePicture();
    tick();

    expect(Camera.getPhoto).toHaveBeenCalledWith({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    expect(console.log).toHaveBeenCalledWith('Image URL:', 'path/to/image.jpg');
  }));

  it('should navigate to /login on goToLogin', () => {
    component.goToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to /carrito with the cart data', () => {
    component.carrito = [{ nombre: 'Figura de Naruto', codigo: 'AN001', valor: 15000 }];
    component.irAlCarrito();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/carrito'], { state: { carrito: component.carrito } });
  });

  it('should search for manga and populate descriptions', fakeAsync(() => {
    const mockResponse = {
      data: [
        { synopsis: 'Manga 1 description' },
        { synopsis: 'Manga 2 description' },
      ],
    };

    const loadingSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    loadingControllerSpy.create.and.returnValue(Promise.resolve(loadingSpy));

    component.searchQuery = 'Naruto';
    component.buscarManga();
    tick();

    const req = httpMock.expectOne(`https://api.jikan.moe/v4/manga?q=Naruto`);
    req.flush(mockResponse);
    tick();

    expect(loadingSpy.present).toHaveBeenCalled();
    expect(loadingSpy.dismiss).toHaveBeenCalled();
    expect(component.mangaDescriptions).toEqual(['Manga 1 description', 'Manga 2 description']);
  }));

  it('should handle errors when searching for manga', fakeAsync(() => {
    const loadingSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    loadingControllerSpy.create.and.returnValue(Promise.resolve(loadingSpy));

    spyOn(window, 'alert');

    component.searchQuery = 'Naruto';
    component.buscarManga();
    tick();

    const req = httpMock.expectOne(`https://api.jikan.moe/v4/manga?q=Naruto`);
    req.error(new ErrorEvent('Network error'));
    tick();

    expect(loadingSpy.present).toHaveBeenCalled();
    expect(loadingSpy.dismiss).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Hubo un error al conectar con el servidor. Por favor, inténtalo nuevamente.');
  }));

  it('should clear the search query and manga descriptions', () => {
    component.searchQuery = 'Naruto';
    component.mangaDescriptions = ['Some description'];

    component.clearSearch();

    expect(component.searchQuery).toBe('');
    expect(component.mangaDescriptions.length).toBe(0);
  });
});
