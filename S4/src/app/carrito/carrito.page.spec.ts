import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPage } from './carrito.page';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';

describe('CarritoPage', () => {
  let component: CarritoPage;
  let fixture: ComponentFixture<CarritoPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    activatedRouteStub = {};

    await TestBed.configureTestingModule({
      declarations: [CarritoPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AlertController, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize items from navigation state', () => {
    const mockItems = [
      { codigo: 'AN001', nombre: 'Figura', cantidad: 1, valor: 15000, totalValor: 15000 },
    ];

    routerSpy.getCurrentNavigation.and.returnValue({
      extras: { state: { carrito: mockItems } },
    } as any);

    fixture = TestBed.createComponent(CarritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.items).toEqual(mockItems);
  });

  it('should increase item quantity and update total value', () => {
    const item = { codigo: 'AN001', nombre: 'Figura', cantidad: 1, valor: 15000, totalValor: 15000 };

    component.aumentarCantidad(item);

    expect(item.cantidad).toBe(2);
    expect(item.totalValor).toBe(30000);
  });

  it('should decrease item quantity and update total value', () => {
    const item = { codigo: 'AN001', nombre: 'Figura', cantidad: 3, valor: 15000, totalValor: 45000 };

    component.disminuirCantidad(item);

    expect(item.cantidad).toBe(2);
    expect(item.totalValor).toBe(30000);
  });

  it('should remove item if quantity is 1 and disminuirCantidad is called', () => {
    const item = { codigo: 'AN001', nombre: 'Figura', cantidad: 1, valor: 15000, totalValor: 15000 };
    component.items = [item];

    spyOn(component, 'eliminarItem').and.callThrough();

    component.disminuirCantidad(item);

    expect(component.eliminarItem).toHaveBeenCalledWith('AN001');
    expect(component.items.length).toBe(0);
  });

  it('should remove item by codigo', () => {
    component.items = [
      { codigo: 'AN001', nombre: 'Figura', cantidad: 1, valor: 15000, totalValor: 15000 },
      { codigo: 'AN002', nombre: 'Póster', cantidad: 2, valor: 5000, totalValor: 10000 },
    ];

    component.eliminarItem('AN001');

    expect(component.items.length).toBe(1);
    expect(component.items[0].codigo).toBe('AN002');
  });

  it('should navigate to principal page', () => {
    component.goToPrincipal();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/principal']);
  });

  it('should navigate to login page', () => {
    component.goToLogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
