import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InventarioComponent } from './inventario/inventario.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta por defecto
  { path: 'login', component: LoginComponent },
  { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard] },
  { path: 'movimientos', component: MovimientosComponent, canActivate: [AuthGuard] }
];
