import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';
import { AuthService } from '../services/auth.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let sqliteServiceSpy: jasmine.SpyObj<SqliteService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    sqliteServiceSpy = jasmine.createSpyObj('SqliteService', ['validateUser']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: SqliteService, useValue: sqliteServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;

  
    alertControllerSpy.create.and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        dismiss: () => Promise.resolve(true),
        onDidDismiss: () => Promise.resolve({}),
        buttons: [],
        backdropDismiss: true,
      } as unknown as HTMLIonAlertElement)
    );
  }); 

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show an alert if email is invalid', fakeAsync(() => {
    component.email = 'invalidEmail';
    component.password = '1234';

    component.onLogin();
    tick();

    expect(alertControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        header: 'Error',
        message: 'Por favor, introduce un correo electrónico válido.',
      })
    );
  }));

  it('should show an alert if password is not 4 digits', fakeAsync(() => {
    component.email = 'test@example.com';
    component.password = '12345';

    component.onLogin();
    tick();

    expect(alertControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        header: 'Error',
        message: 'La contraseña debe tener exactamente 4 dígitos.',
      })
    );
  }));

  it('should navigate to /principal on successful login', fakeAsync(() => {
    component.email = 'test@example.com';
    component.password = '1234';

    sqliteServiceSpy.validateUser.and.returnValue(Promise.resolve(true));
    authServiceSpy.login.and.returnValue(Promise.resolve(true));

    component.onLogin();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/principal'], { state: { email: 'test@example.com' } });
  }));

  it('should show an alert if credentials are incorrect', fakeAsync(() => {
    component.email = 'test@example.com';
    component.password = '1234';

    sqliteServiceSpy.validateUser.and.returnValue(Promise.resolve(false));

    component.onLogin();
    tick();

    expect(alertControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        header: 'Error',
        message: 'Credenciales incorrectas. Por favor, verifica tu email o contraseña.',
      })
    );
  }));

  it('should show an alert on login error', fakeAsync(() => {
    component.email = 'test@example.com';
    component.password = '1234';

    sqliteServiceSpy.validateUser.and.returnValue(Promise.reject('Error'));

    component.onLogin();
    tick();

    expect(alertControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        header: 'Error',
        message: 'Hubo un problema al procesar tu solicitud. Intenta nuevamente.',
      })
    );
  }));

  it('should navigate to /home on register', () => {
    component.onRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should clear the form', () => {
    component.email = 'test@example.com';
    component.password = '1234';

    component.clearForm();

    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });
});
