import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { CardCarroComponent } from '../../components/card-carro/card-carro.component';
import { Observable, forkJoin, of } from 'rxjs';
import { Carro, CarroService } from '../../services/carro.service';
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


  searchTerm = '';
  searchResults: Carro[] = [];
  sucessoReserva = '';
  erroReserva = '';



  constructor(
    private carroService: CarroService,
    private auth: AutenticacaoService,
    private reservaService: ReservaService
  ) {
    const user = this.auth.getUser();
    if (user) {
      this.usuario = user as Usuario;
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

  pesquisar() {
    const query = (this.searchTerm || '').trim();
    if (!query) {
      this.searchResults = [];
      return;
    }

    this.carroService.listarCarros().subscribe({
      next: (itens) => {
        this.searchResults = itens.filter((c) => c.name && c.name.toLowerCase().includes(query.toLowerCase()));
      },
      error: () => {
        this.searchResults = [];
      }
    });
  }

  reservaConfirmModal = false;
  reservaCarroSelecionado?: Carro;

  solicitarReserva(c: Carro) {
    this.reservaCarroSelecionado = c;
    this.reservaConfirmModal = true;
    this.sucessoReserva = '';
    this.erroReserva = '';
  }

  confirmarReserva(res: boolean) {
    if (!res) {
      this.reservaConfirmModal = false;
      this.reservaCarroSelecionado = undefined;
      return;
    }

    const c = this.reservaCarroSelecionado;
    if (!c) return;

    const user = this.auth.getUser();
    if (!user) {
      this.erroReserva = 'Você precisa estar logado para reservar.';
      this.reservaConfirmModal = false;
      this.reservaCarroSelecionado = undefined;
      return;
    }

    const payload = { usuarioId: user.id, carroId: c.id };
    this.reservaService.criarReserva(payload).subscribe({
      next: (r) => {
        this.sucessoReserva = 'Reserva criada com sucesso.';
        this.carrosReservados.unshift(c);
        this.searchResults = this.searchResults.filter((x) => x.id !== c.id);
        this.reservaConfirmModal = false;
        this.reservaCarroSelecionado = undefined;
        setTimeout(() => (this.sucessoReserva = ''), 3000);
      },
      error: () => {
        this.erroReserva = 'Erro ao criar reserva.';
        this.reservaConfirmModal = false;
        this.reservaCarroSelecionado = undefined;
        setTimeout(() => (this.erroReserva = ''), 3000);
      }
    });
  }
}
