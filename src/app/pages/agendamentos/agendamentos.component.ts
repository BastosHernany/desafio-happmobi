import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { ReservaService, Reserva } from '../../services/reserva.service';
import { CarroService, Carro } from '../../services/carro.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MenuComponent } from '../../components/menu/menu.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CardCarroComponent } from '../../components/card-carro/card-carro.component';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MenuComponent, HeaderComponent, CardCarroComponent],
  templateUrl: './agendamentos.component.html',
  styleUrl: './agendamentos.component.css'
})
export class AgendamentosComponent {
  reservas: Reserva[] = [];
  carrosReservados: Carro[] = [];
  carregando = true;

  confirmModal = false;
  confirmType: 'cancelar' | 'finalizar' | null = null;
  selectedReserva?: Reserva;

  mensagem = '';

  constructor(
    private auth: AutenticacaoService,
    private reservaService: ReservaService,
    private carroService: CarroService,
    private router: Router
  ) {
    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    const user = this.auth.getUser();
    if (!user) {
      this.carrosReservados = [];
      this.reservas = [];
      this.carregando = false;
      return;
    }

    this.reservaService.listarPorUsuario(user.id).pipe(
      switchMap((reservas: Reserva[]) => {
        this.reservas = reservas || [];
        if (!reservas || reservas.length === 0) {
          this.carrosReservados = [];
          return of([]);
        }
        const chamadas = reservas.map(r => this.carroService.obterPorId(r.carroId as string | number));
        return forkJoin(chamadas);
      })
    ).subscribe({
      next: (carros: any) => {
        this.carrosReservados = carros || [];
        this.carregando = false;
      },
      error: () => {
        this.carrosReservados = [];
        this.carregando = false;
      }
    });
  }

  solicitarConfirmacao(r: Reserva, tipo: 'cancelar' | 'finalizar', index: number) {
    this.selectedReserva = r;
    this.confirmType = tipo;
    this.confirmModal = true;
  }

  confirmarAcao(confirm: boolean) {
    if (!confirm) {
      this.confirmModal = false;
      this.selectedReserva = undefined;
      this.confirmType = null;
      return;
    }

    if (!this.selectedReserva || !this.selectedReserva.id) return;

    this.reservaService.cancelarReserva(this.selectedReserva.id).subscribe({
      next: () => {
        this.confirmModal = false;
        this.mensagem = this.confirmType === 'cancelar' ? 'Cancelamento realizado com sucesso.' : 'Finalização da reserva realizada com sucesso.';
        this.selectedReserva = undefined;
        this.confirmType = null;
        // recarrega lista
        this.carregarAgendamentos();
        setTimeout(() => (this.mensagem = ''), 3000);
      },
      error: () => {
        this.mensagem = 'Erro ao processar ação.';
        this.confirmModal = false;
      }
    });
  }

}
