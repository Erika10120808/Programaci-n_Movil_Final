import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrincipalPage } from './principal.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { CartService } from '../services/cart.service';

describe('PrincipalPage', () => {
    let component: PrincipalPage;
    let fixture: ComponentFixture<PrincipalPage>;
    let cartService: CartService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PrincipalPage],
            imports: [
                IonicModule.forRoot(),
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [CartService]
        }).compileComponents();

        fixture = TestBed.createComponent(PrincipalPage);
        component = fixture.componentInstance;
        cartService = TestBed.inject(CartService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with empty cart', () => {
        expect(component.carrito.length).toBe(0);
    });

    it('should have 5 anime items', () => {
        expect(component.animeItems.length).toBe(5);
    });

    it('should initialize with empty search query', () => {
        expect(component.searchQuery).toBe('');
    });

    it('should clear search', () => {
        component.searchQuery = 'test';
        component.mangaDescriptions = ['test description'];
        component.clearSearch();
        expect(component.searchQuery).toBe('');
        expect(component.mangaDescriptions.length).toBe(0);
    });

    it('should handle checkbox change', () => {
        const testItem = component.animeItems[0];
        spyOn(console, 'log');
        component.onCheckboxChange(testItem);
        expect(console.log).toHaveBeenCalledWith('Checkbox changed for item:', testItem);
    });
});