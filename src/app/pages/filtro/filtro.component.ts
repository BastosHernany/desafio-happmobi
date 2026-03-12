import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Carro, CarroService } from '../../services/carro.service';
import { ReservaService } from '../../services/reserva.service';
import { CardCarroComponent } from '../../components/card-carro/card-carro.component';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule, FormsModule, CardCarroComponent],
  templateUrl: './filtro.component.html',
})

export class FiltroComponent {
  search = '';
  mostrarFormulario = true;
  carrosEncontrados: Carro[] = [];
  carrosDisponiveis: Carro[] = [];
  carregando = false;
  naoEncontrado = false;

  // estados e mensagens para reserva
  reservaConfirmModal = false;
  reservaCarroSelecionado?: Carro;
  sucessoReserva = '';
  erroReserva = '';
  reservaErroModal = false;
  reservaErroMensagem = '';
  reservaErroIrAgendamentos = false;

  selecionadasCarrocerias = new Set<string>();
  selecionadosMotores = new Set<string>();
  selecionadosLugares = new Set<string>();

  carroceriasOptions: string[] = [
    'Hatch compacto',
    'Hatch médio',
    'SUV compacto',
    'SUV médio',
    'SUV grande',
    'Crossover',
    'Coupé',
    'Picape leve',
    'Picape leve-média',
    'Picape média',
    'Sedan Compacto',
    'Sedan médio',
    'Sedan grande',
    'Minivan',
    'Utilitário leve',
    'Utilitário',
  ];

  motoresOptions: string[] = ['1.0', '1.4', '1.6', '1.8', '2.0'];
  lugaresOptions: string[] = ['02', '03', '04', '05', '06', '07'];

  constructor(
    private carroService: CarroService,
    private reservaService: ReservaService,
    public router: Router,
    private auth: AutenticacaoService
  ) {}

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

    // checar se o usuário já tem reserva ativa
    this.reservaService.listarPorUsuario(user.id).subscribe({
      next: (minhas) => {
        if (minhas && minhas.length > 0) {
          this.reservaErroMensagem = 'Você já possui uma reserva ativa.';
          this.reservaErroIrAgendamentos = true;
          this.reservaErroModal = true;
          return;
        }

        // checar se o veículo já está reservado por qualquer usuário
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
        // remover das listas de resultado
        this.carrosEncontrados = this.carrosEncontrados.filter(x => String(x.id) !== String(c.id));
        this.carrosDisponiveis = this.carrosDisponiveis.filter(x => String(x.id) !== String(c.id));
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

  onSearchChange(value: string) {
    this.search = value;
    if (!value || value.trim() === '') {
      // quando o campo de busca for limpo, restaurar a visualização de filtros
      this.carrosEncontrados = [];
      this.carrosDisponiveis = [];
      this.naoEncontrado = false;
      this.mostrarFormulario = true;
    }
  }

  toggleCarroceria(item: string) {
    if (this.selecionadasCarrocerias.has(item)) this.selecionadasCarrocerias.delete(item);
    else this.selecionadasCarrocerias.add(item);
  }

  toggleMotor(item: string) {
    if (this.selecionadosMotores.has(item)) this.selecionadosMotores.delete(item);
    else this.selecionadosMotores.add(item);
  }

  toggleLugar(item: string) {
    if (this.selecionadosLugares.has(item)) this.selecionadosLugares.delete(item);
    else this.selecionadosLugares.add(item);
  }

  aplicarFiltro() {
    this.carregando = true;
    this.carroService.listarCarros().subscribe({
      next: (itens) => {
        const resultados = itens.filter((c) => {
          // busca por texto (nome)
          if (this.search && !c.name.toLowerCase().includes(this.search.toLowerCase())) return false;

          // carrocerias
          if (this.selecionadasCarrocerias.size > 0) {
            const ok = Array.from(this.selecionadasCarrocerias).some((sel) =>
              c.type?.toLowerCase().includes(sel.toLowerCase())
            );
            if (!ok) return false;
          }

          // motores
          if (this.selecionadosMotores.size > 0) {
            const ok = Array.from(this.selecionadosMotores).some((m) => m === c.engine);
            if (!ok) return false;
          }

          // lugares
          if (this.selecionadosLugares.size > 0) {
            const ok = Array.from(this.selecionadosLugares).some((l) => String(Number(l)) === String(Number(c.size)));
            if (!ok) return false;
          }

          return true;
        });

        this.carrosEncontrados = resultados;
        this.carregando = false;
        this.mostrarFormulario = false;
        this.naoEncontrado = resultados.length === 0;

        if (this.naoEncontrado) {
          // listar carros disponíveis (excluir os que já estão reservados)
          this.carroService.listarCarros().subscribe({
            next: (itens) => {
              this.reservaService.listarTodas().subscribe({
                next: (reservas) => {
                  const idsReservados = new Set((reservas || []).map(r => String(r.carroId)));
                  this.carrosDisponiveis = (itens || []).filter(i => !idsReservados.has(String(i.id)));
                },
                error: () => {
                  this.carrosDisponiveis = itens || [];
                }
              });
            },
            error: () => {
              this.carrosDisponiveis = [];
            }
          });
        }
      },
      error: () => {
        this.carrosEncontrados = [];
        this.carregando = false;
        this.mostrarFormulario = false;
        this.naoEncontrado = true;
      },
    });
  }

  mostrarFiltros() {
    this.mostrarFormulario = true;
  }

  limparTudo() {
    this.selecionadasCarrocerias.clear();
    this.selecionadosMotores.clear();
    this.selecionadosLugares.clear();
    this.search = '';
    this.carrosEncontrados = [];
    this.naoEncontrado = false;
    this.mostrarFormulario = true;
  }

  cancelar() {
    this.router.navigate(['/inicio']);
  }
}
