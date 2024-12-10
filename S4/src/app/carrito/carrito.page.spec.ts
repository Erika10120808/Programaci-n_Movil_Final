import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPage } from './carrito.page';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, ParamMap, convertToParamMap } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';

describe('CarritoPage', () => {
  let component: CarritoPage;
  let fixture: ComponentFixture<CarritoPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);

  
    const mockSnapshot: Partial<ActivatedRouteSnapshot> = {
      paramMap: convertToParamMap({ id: '123' }),
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      data: {},
      outlet: '',
      component: null,
      routeConfig: null,
      root: {} as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
    };

    activatedRouteStub = {
      snapshot: mockSnapshot as ActivatedRouteSnapshot,
    };

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

 
    routerSpy.getCurrentNavigation.and.returnValue({
      extras: {
        state: {
          carrito: [
            { codigo: 'AN001', nombre: 'Figura', cantidad: 1, valor: 15000, totalValor: 15000 },
          ],
        },
      },
    } as any);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize items from navigation state', () => {
    expect(component.items).toEqual([
      { codigo: 'AN001', nombre: 'Figura', cantidad: 1, valor: 15000, totalValor: 15000 },
    ]);
  });
});
