import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritoservicePage } from './carritoservice.page';

const routes: Routes = [
  {
    path: '',
    component: CarritoservicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritoservicePageRoutingModule {}
