import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoservicePage } from './carritoservice.page';

describe('CarritoservicePage', () => {
  let component: CarritoservicePage;
  let fixture: ComponentFixture<CarritoservicePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoservicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
