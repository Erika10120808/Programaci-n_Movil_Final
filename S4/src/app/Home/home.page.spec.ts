import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HomePage } from './home.page';
import { SqliteService } from '../services/sqlite.service';
import { FormsModule } from '@angular/forms';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let sqliteServiceSpy: jasmine.SpyObj<SqliteService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    sqliteServiceSpy = jasmine.createSpyObj('SqliteService', ['create']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: SqliteService, useValue: sqliteServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should register user successfully', async () => {
    spyOn(component, 'showAlert');

    component.email = 'test@example.com';
    component.nombre = 'John';
    component.apellido = 'Doe';
    component.nivelEducacional = 'Universitario';
    component.fechaNacimiento = new Date();
    component.password = '1234';

    const mockResponse: capSQLiteChanges = { changes: { changes: 1, lastId: 1 } };
    sqliteServiceSpy.create.and.returnValue(Promise.resolve(mockResponse));

    await component.registrarUsuario();

    expect(sqliteServiceSpy.create).toHaveBeenCalled();
    expect(component.showAlert).toHaveBeenCalledWith('Éxito', 'Usuario registrado correctamente.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error during user registration', async () => {
    spyOn(component, 'showAlert');

    component.email = 'test@example.com';
    component.nombre = 'John';
    component.apellido = 'Doe';
    component.nivelEducacional = 'Universitario';
    component.fechaNacimiento = new Date();
    component.password = '1234';

    sqliteServiceSpy.create.and.returnValue(Promise.reject(new Error('Error')));

    await component.registrarUsuario();

    expect(component.showAlert).toHaveBeenCalledWith('Error', 'No se pudo registrar el usuario. Verifica tus datos o intenta nuevamente.');
  });
});
