import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; 

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./Home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then((m) => m.PrincipalPageModule),
    //canActivate: [AuthGuard], 
  },
  {
    path: 'carrito',
    loadChildren: () => import('./carrito/carrito.module').then((m) => m.CarritoPageModule),
    //canActivate: [AuthGuard], 
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}