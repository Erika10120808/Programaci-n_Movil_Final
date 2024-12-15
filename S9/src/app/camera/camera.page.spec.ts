import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraPage } from './camera.page';
import { Camera } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';

describe('CameraPage', () => {
    let component: CameraPage;
    let fixture: ComponentFixture<CameraPage>;

    beforeEach(async () => {
        spyOn(Camera, 'getPhoto');

        await TestBed.configureTestingModule({
            imports: [
                CameraPage,
                IonicModule.forRoot()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CameraPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize imageUrl as null', () => {
        expect(component.imageUrl).toBeNull();
    });
});