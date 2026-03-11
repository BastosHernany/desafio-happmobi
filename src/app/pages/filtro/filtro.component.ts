import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private carroService: CarroService, private reservaService: ReservaService, private router: Router) {}

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
