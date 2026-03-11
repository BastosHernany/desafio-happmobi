import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { CardCarroComponent } from '../../components/card-carro/card-carro.component';
import { Observable, forkJoin, of } from 'rxjs';
import { Carro, CarroService } from '../../services/carro.service';
import { ArrastarScrollDirective } from '../../directives/drag-scroll.directive';
import { RouterModule } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Usuario } from '../../services/usuario.service';
import { ReservaService, Reserva } from '../../services/reserva.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent, CardCarroComponent, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  carros$: Observable<Carro[]> | null = null;
  carrosReservados: Carro[] = [];

  usuario: Usuario | null = null;
  nomeUsuario = 'Usuário';
  fotoUsuario = '';
  carregandoReservas = true;



  constructor(
    private carroService: CarroService,
    private auth: AutenticacaoService,
    private reservaService: ReservaService
  ) {
    const u = this.auth.getUser();
    if (u) {
      this.usuario = u as Usuario;
      this.nomeUsuario = this.usuario.nome || 'Usuário';
      this.fotoUsuario = this.usuario.imagemUrl || '';

      this.reservaService.listarPorUsuario(this.usuario.id!).pipe(
        switchMap((reservas: Reserva[]) => {
          if (!reservas || reservas.length === 0) {
            this.carrosReservados = [];
            this.carros$ = null;
            this.carregandoReservas = false;
            return of([]);
          }

          const chamadas = reservas.map(r => this.carroService.obterPorId(r.carroId as string | number));
          return forkJoin(chamadas);
        })
      ).subscribe({
        next: (carros: any) => {
          this.carrosReservados = carros || [];
          this.carregandoReservas = false;
        },
        error: () => {
          this.carrosReservados = [];
          this.carregandoReservas = false;
        }
      });
    } else {

      this.carrosReservados = [];
      this.carros$ = null;
      this.carregandoReservas = false;
    }
  }


  

}
