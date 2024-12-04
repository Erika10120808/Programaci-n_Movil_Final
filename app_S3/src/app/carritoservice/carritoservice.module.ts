import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarritoservicePageRoutingModule } from './carritoservice-routing.module';

import { CarritoservicePage } from './carritoservice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarritoservicePageRoutingModule
  ],
  declarations: [CarritoservicePage]
})
export class CarritoservicePageModule {}
