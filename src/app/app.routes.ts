import { Routes } from '@angular/router'

//Componentes;
import { LoginComponent } from './pages/login/login.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { FiltroComponent } from './pages/filtro/filtro.component';
import { CriarContaComponent } from './pages/criar-conta/criar-conta.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AgendamentosComponent } from './pages/agendamentos/agendamentos.component';
import { CentralComponent } from './pages/central/central.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
	{ path: 'filtro', component: FiltroComponent, canActivate: [AuthGuard] },
	{ path: 'agendamentos', component: AgendamentosComponent, canActivate: [AuthGuard] },
	{ path: 'central', component: CentralComponent, canActivate: [AuthGuard] },
	{ path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
	{ path: 'criar-conta', component: CriarContaComponent },
	{ path: '**', redirectTo: '' }
];
