import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Carro, CarroService } from '../../services/carro.service';
import { CardCarroComponent } from '../../components/card-carro/card-carro.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-central',
  standalone: true,
  imports: [CommonModule, FormsModule, CardCarroComponent, HeaderComponent, MenuComponent],
  templateUrl: './central.component.html'
})
export class CentralComponent implements OnInit {
  carros: Carro[] = [];
  sucessoMensagem = '';
  erroMensagem = '';

  mostrandoModalAdicionar = false;
  novoVeiculo: Partial<Carro> = {};

  mostrandoDetalhes = false;
  carroSelecionado?: Carro;
  carroEdicao: Partial<Carro> = {};
  modalConfirmDelete = false;

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

  constructor(private carroService: CarroService) {}

  ngOnInit(): void {
    this.carregarCarros();
  }

  carregarCarros() {
    this.carroService.listarCarros().subscribe({
      next: (list) => (this.carros = list || []),
      error: () => (this.carros = [])
    });
  }

  abrirModalAdicionar() {
    this.novoVeiculo = {};
    this.mostrandoModalAdicionar = true;
  }

  fecharModalAdicionar() {
    this.mostrandoModalAdicionar = false;
  }

  salvarCarro() {
    this.erroMensagem = '';
    if (!this.novoVeiculo.name || !this.novoVeiculo.year || !this.novoVeiculo.type || !this.novoVeiculo.engine || !this.novoVeiculo.size) {
      this.erroMensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const payload: Partial<Carro> = {
      name: this.novoVeiculo.name,
      year: this.novoVeiculo.year,
      type: this.novoVeiculo.type,
      engine: this.novoVeiculo.engine,
      size: this.novoVeiculo.size,
      imageUrl: this.novoVeiculo.imageUrl || undefined
    };

    this.carroService.criarCarro(payload).subscribe({
      next: (c) => {
        this.sucessoMensagem = 'Novo veículo cadastrado com sucesso';
        this.carros.unshift(c);
        this.mostrandoModalAdicionar = false;
        this.erroMensagem = '';
        setTimeout(() => (this.sucessoMensagem = ''), 3500);
      },
      error: () => {
        this.sucessoMensagem = 'Erro ao cadastrar veículo';
        this.erroMensagem = '';
        setTimeout(() => (this.sucessoMensagem = ''), 3500);
      }
    });
  }

  abrirDetalhes(c: Carro) {
    this.carroSelecionado = c;
    this.carroEdicao = { ...c };
    this.mostrandoDetalhes = true;
  }

  fecharDetalhes() {
    this.mostrandoDetalhes = false;
    this.carroSelecionado = undefined;
  }

  atualizarCarro() {
    if (!this.carroSelecionado) return;
    this.erroMensagem = '';
    if (!this.carroEdicao.name || !this.carroEdicao.year || !this.carroEdicao.type || !this.carroEdicao.engine || !this.carroEdicao.size) {
      this.erroMensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }
    const id = this.carroSelecionado.id as number | string;
    this.carroService.atualizarCarro(id, this.carroEdicao).subscribe({
      next: (updated) => {
        this.sucessoMensagem = 'Veículo atualizado com sucesso';
        this.carros = this.carros.map((c) => (c.id === updated.id ? updated : c));
        this.mostrandoDetalhes = false;
        this.erroMensagem = '';
        setTimeout(() => (this.sucessoMensagem = ''), 3000);
      },
      error: () => {
        this.sucessoMensagem = 'Erro ao atualizar veículo';
        setTimeout(() => (this.sucessoMensagem = ''), 3000);
      }
    });
  }

  confirmarDeletar() {
    if (!this.carroSelecionado) return;
    this.modalConfirmDelete = true;
  }
  deletarCarro(id: number | string) {
    this.carroService.deletarCarro(id).subscribe({
      next: () => {
        this.sucessoMensagem = 'Veículo excluído com sucesso';
        this.carros = this.carros.filter((c) => c.id !== id);
        this.mostrandoDetalhes = false;
        this.modalConfirmDelete = false;
        setTimeout(() => (this.sucessoMensagem = ''), 3000);
      },
      error: () => {
        this.sucessoMensagem = 'Erro ao excluir veículo';
        setTimeout(() => (this.sucessoMensagem = ''), 3000);
      }
    });
  }

  confirmarDeleteResposta(confirm: boolean) {
    if (!confirm) {
      this.modalConfirmDelete = false;
      return;
    }
    if (!this.carroSelecionado) return;
    this.deletarCarro(this.carroSelecionado.id as number | string);
  }
}
