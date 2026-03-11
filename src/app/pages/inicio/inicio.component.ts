import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { CardCarroComponent } from '../../components/card-carro/card-carro.component';
import { Observable, forkJoin, of } from 'rxjs';
import { Carro, CarroService } from '../../services/carro.service';
import { RouterModule, Router } from '@angular/router';
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
  carrosAtivos: Carro[] = [];
  temReservasAtivas = false;

  usuario: Usuario | null = null;
  nomeUsuario = 'Usuário';
  fotoUsuario = '';
  carregandoReservas = true;


<<<<<<< HEAD
  searchTerm = '';
  searchResults: Carro[] = [];
  sucessoReserva = '';
  erroReserva = '';
  // novos estados para regras de reserva
  reservaErroModal = false;
  reservaErroMensagem = '';
  reservaErroIrAgendamentos = false;


=======
>>>>>>> 828f236e78a66e0e7f60932157a5f08985d9238d

  constructor(
    private carroService: CarroService,
    private auth: AutenticacaoService,
    private reservaService: ReservaService,
    public router: Router
  ) {
    const user = this.auth.getUser();
    if (user) {
      this.usuario = user as Usuario;
      this.nomeUsuario = this.usuario.nome || 'Usuário';
      this.fotoUsuario = this.usuario.imagemUrl || '';

      this.reservaService.listarPorUsuario(this.usuario.id!).pipe(
        switchMap((reservas: Reserva[]) => {
          this.temReservasAtivas = !!(reservas && reservas.length > 0);
          if (!reservas || reservas.length === 0) {
            this.carrosAtivos = [];
            this.carros$ = null;
            this.carregandoReservas = false;
            return of([]);
          }

          const chamadas = reservas.map(r => this.carroService.obterPorId(r.carroId as string | number));
          return forkJoin(chamadas);
        })
      ).subscribe({
        next: (carros: any) => {
<<<<<<< HEAD
          this.carrosAtivos = carros || [];
          // carregar histórico local e mesclar (manter únicos)
          const historico = this.loadHistoricoReservas();
          const mapa = new Map<string | number, Carro>();
          // primeiro as reservas ativas (mais recentes primeiro)
          (this.carrosAtivos || []).forEach((c: Carro) => mapa.set(String(c.id), c));
          // depois completar com histórico se não existir
          (historico || []).forEach((h: Carro) => {
            if (!mapa.has(String(h.id))) mapa.set(String(h.id), h);
          });
          this.carrosReservados = Array.from(mapa.values());
=======
          this.carrosReservados = carros || [];
>>>>>>> 828f236e78a66e0e7f60932157a5f08985d9238d
          this.carregandoReservas = false;
        },
        error: () => {
          this.carrosReservados = [];
          this.carrosAtivos = [];
          this.carregandoReservas = false;
        }
      });
    } else {

      this.carrosReservados = [];
      this.carros$ = null;
      this.carregandoReservas = false;
    }
  }

<<<<<<< HEAD
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
=======

  
>>>>>>> 828f236e78a66e0e7f60932157a5f08985d9238d

  reservaConfirmModal = false;
  reservaCarroSelecionado?: Carro;

  solicitarReserva(c: Carro) {
    // reset mensagens
    this.sucessoReserva = '';
    this.erroReserva = '';
    this.reservaErroModal = false;
    this.reservaErroMensagem = '';
    this.reservaErroIrAgendamentos = false;

    const user = this.auth.getUser();
    if (!user) {
      this.erroReserva = 'Você precisa estar logado para reservar.';
      return;
    }

    // 1) checar se o usuário já tem reserva ativa
    this.reservaService.listarPorUsuario(user.id).subscribe({
      next: (minhas) => {
        if (minhas && minhas.length > 0) {
          this.reservaErroMensagem = 'Você já possui uma reserva ativa.';
          this.reservaErroIrAgendamentos = true;
          this.reservaErroModal = true;
          return;
        }

        // 2) checar se o veículo já está reservado por qualquer usuário
        this.reservaService.listarTodas().subscribe({
          next: (todas) => {
            const ocupado = (todas || []).some(r => String(r.carroId) === String(c.id));
            if (ocupado) {
              this.reservaErroMensagem = 'Veículo já está reservado.';
              this.reservaErroIrAgendamentos = false;
              this.reservaErroModal = true;
              return;
            }

            // tudo ok — abrir modal de confirmação
            this.reservaCarroSelecionado = c;
            this.reservaConfirmModal = true;
          },
          error: () => {
            this.erroReserva = 'Erro ao verificar disponibilidade.';
          }
        });
      },
      error: () => {
        this.erroReserva = 'Erro ao verificar suas reservas.';
      }
    });
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
        // marcar que há reservas ativas e atualizar lista ativa
        this.temReservasAtivas = true;
        this.carrosAtivos.unshift(c);
        // salvar no histórico local para manter o carro nas "últimas reservas" mesmo após finalizar
        this.saveHistoricoReserva(c);
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

  private HISTORICO_KEY = 'ultimasReservas';

  private loadHistoricoReservas(): Carro[] {
    try {
      const raw = localStorage.getItem(this.HISTORICO_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Carro[];
    } catch {
      return [];
    }
  }

  private saveHistoricoReserva(c: Carro) {
    try {
      const atual = this.loadHistoricoReservas();
      const filtrado = (atual || []).filter((x) => String(x.id) !== String(c.id));
      filtrado.unshift(c);
      // limitar histórico para os 12 mais recentes
      localStorage.setItem(this.HISTORICO_KEY, JSON.stringify(filtrado.slice(0, 12)));
    } catch {
      // ignore
    }
  }
}
