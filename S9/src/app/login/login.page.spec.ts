import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

describe('LoginPage', () => {
    let component: LoginPage;
    let fixture: ComponentFixture<LoginPage>;
    let router: jasmine.SpyObj<Router>;
    let alertController: jasmine.SpyObj<AlertController>;
    let sqliteService: jasmine.SpyObj<SqliteService>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
        const sqliteServiceSpy = jasmine.createSpyObj('SqliteService', ['validateUser']);
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

        await TestBed.configureTestingModule({
            declarations: [LoginPage],
            imports: [
                IonicModule.forRoot(),
                FormsModule
            ],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: AlertController, useValue: alertControllerSpy },
                { provide: SqliteService, useValue: sqliteServiceSpy },
                { provide: AuthService, useValue: authServiceSpy }
            ]
        }).compileComponents();

        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
        sqliteService = TestBed.inject(SqliteService) as jasmine.SpyObj<SqliteService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should validate email format', async () => {
        const alertSpy = jasmine.createSpyObj('Alert', ['present']);
        alertController.create.and.returnValue(Promise.resolve(alertSpy));

        component.email = 'invalid-email';
        component.password = '1234';
        await component.onLogin();

        expect(alertController.create).toHaveBeenCalledWith({
            header: 'Error',
            message: 'Por favor, introduce un correo electrónico válido.',
            buttons: ['OK']
        });
    });

    it('should validate password format', async () => {
        const alertSpy = jasmine.createSpyObj('Alert', ['present']);
        alertController.create.and.returnValue(Promise.resolve(alertSpy));

        component.email = 'test@test.com';
        component.password = '123';
        await component.onLogin();

        expect(alertController.create).toHaveBeenCalledWith({
            header: 'Error',
            message: 'La contraseña debe tener exactamente 4 dígitos.',
            buttons: ['OK']
        });
    });

    it('should navigate to principal on successful login', async () => {
        component.email = 'test@test.com';
        component.password = '1234';
        
        sqliteService.validateUser.and.returnValue(Promise.resolve(true));
        authService.login.and.returnValue(Promise.resolve(true));

        await component.onLogin();
    
        expect(sqliteService.validateUser).toHaveBeenCalledWith('test@test.com', '1234');
        expect(authService.login).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/principal'], { 
            state: { email: 'test@test.com' } 
        });
    });

    it('should clear form fields', () => {
        component.email = 'test@test.com';
        component.password = '1234';
        
        component.clearForm();
        
        expect(component.email).toBe('');
        expect(component.password).toBe('');
    });
});