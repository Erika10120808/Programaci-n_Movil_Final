import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { CarritoPageRoutingModule } from './carrito-routing.module';
import { CarritoPage } from './carrito.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    CarritoPageRoutingModule,

  ],
  declarations: [CarritoPage]
})
export class CarritoPageModule {}
