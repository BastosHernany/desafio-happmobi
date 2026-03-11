import { Routes } from '@angular/router'

//Componentes;
import { LoginComponent } from './pages/login/login.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { FiltroComponent } from './pages/filtro/filtro.component';

export const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'inicio', component: InicioComponent },
    { path: 'filtro', component: FiltroComponent },
	{ path: '**', redirectTo: '' }
];
