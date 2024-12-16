import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { SqliteService } from '../services/sqlite.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let sqliteService: jasmine.SpyObj<SqliteService>;
  let alertController: jasmine.SpyObj<AlertController>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const sqliteSpy = jasmine.createSpyObj('SqliteService', ['create']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    sqliteSpy.create.and.returnValue(Promise.resolve({
      changes: { changes: 1 },
      lastId: 1
    }));

    alertSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    } as any));

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: SqliteService, useValue: sqliteSpy },
        { provide: AlertController, useValue: alertSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    sqliteService = TestBed.inject(SqliteService) as jasmine.SpyObj<SqliteService>;
    alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate empty fields', async () => {
    await component.registrarUsuario();
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Campos incompletos',
      message: 'Por favor, completa todos los campos antes de continuar.',
      buttons: ['OK']
    });
  });

  it('should validate email format', async () => {
    component.email = 'invalid-email';
    component.nombre = 'Test';
    component.apellido = 'User';
    component.nivelEducacional = 'Superior';
    component.fechaNacimiento = '2000-01-01';
    component.password = '1234';

    await component.registrarUsuario();
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Por favor, introduce un correo electrónico válido.',
      buttons: ['OK']
    });
  });

  it('should validate password format', async () => {
    component.email = 'test@example.com';
    component.nombre = 'Test';
    component.apellido = 'User';
    component.nivelEducacional = 'Superior';
    component.fechaNacimiento = '2000-01-01';
    component.password = '12345';

    await component.registrarUsuario();
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'La contraseña debe tener exactamente 4 dígitos numéricos.',
      buttons: ['OK']
    });
  });

  it('should clear form', () => {
    component.email = 'erika@erika.cl';
    component.nombre = 'erika';
    component.apellido = 'munoz';
    component.nivelEducacional = 'Universidad';
    component.fechaNacimiento = '2000-01-01';
    component.password = '1234';

    component.clearForm();

    expect(component.email).toBe('');
    expect(component.nombre).toBe('');
    expect(component.apellido).toBe('');
    expect(component.nivelEducacional).toBe('');
    expect(component.fechaNacimiento).toBeNull();
    expect(component.password).toBe('');
  });
});
