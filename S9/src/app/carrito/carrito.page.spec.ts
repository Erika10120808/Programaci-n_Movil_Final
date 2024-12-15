import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPage } from './carrito.page';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

describe('CarritoPage', () => {
    let component: CarritoPage;
    let fixture: ComponentFixture<CarritoPage>;
    let routerSpy: jasmine.SpyObj<Router>;
    let alertControllerSpy: jasmine.SpyObj<AlertController>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
        alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

        await TestBed.configureTestingModule({
            declarations: [CarritoPage],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: {} },
                { provide: AlertController, useValue: alertControllerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CarritoPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should increase quantity and total value', () => {
        const item = { cantidad: 1, valor: 100, totalValor: 100 };
        component.aumentarCantidad(item);
        expect(item.cantidad).toBe(2);
        expect(item.totalValor).toBe(200);
    });

    it('should decrease quantity and total value', () => {
        const item = { cantidad: 2, valor: 100, totalValor: 200 };
        component.disminuirCantidad(item);
        expect(item.cantidad).toBe(1);
        expect(item.totalValor).toBe(100);
    });

    it('should remove item when quantity reaches 0', () => {
        const item = { codigo: '123', cantidad: 1, valor: 100 };
        component.items = [item];
        component.disminuirCantidad(item);
        expect(component.items.length).toBe(0);
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