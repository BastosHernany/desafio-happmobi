import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Carro, CarroService } from '../../services/carro.service';
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
  carregando = false;
  naoEncontrado = false;
  mostrandoModalAdicionar = false;
  sucessoMensagem = '';

  novoVeiculo: Partial<Carro> = {
    name: '',
    year: '',
    type: '',
    engine: '',
    size: '',
    imageUrl: ''
  };

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

  constructor(private carroService: CarroService, private router: Router) {}

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

  abrirModalAdicionar() {
    this.mostrandoModalAdicionar = true;
    this.sucessoMensagem = '';
  }

  fecharModalAdicionar() {
    this.mostrandoModalAdicionar = false;
    this.novoVeiculo = { name: '', year: '', type: '', engine: '', size: '', imageUrl: '' };
  }

  salvarCarro() {
    const payload: Partial<Carro> = {
      name: this.novoVeiculo.name || 'Sem nome',
      year: this.novoVeiculo.year || '',
      type: this.novoVeiculo.type || '',
      engine: this.novoVeiculo.engine || '',
      size: this.novoVeiculo.size || '',
      imageUrl: this.novoVeiculo.imageUrl || undefined
    };

    this.carroService.criarCarro(payload).subscribe({
      next: (c) => {
        // mostrar sucesso e adicionar ao resultado
        this.sucessoMensagem = 'Novo veiculo cadastrado com sucesso';
        this.carrosEncontrados.unshift(c);
        this.mostrandoModalAdicionar = false;
        this.mostrarFormulario = false;
        this.naoEncontrado = false;
        setTimeout(() => (this.sucessoMensagem = ''), 3500);
      },
      error: () => {
        this.sucessoMensagem = 'Erro ao cadastrar veículo';
        setTimeout(() => (this.sucessoMensagem = ''), 3500);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/inicio']);
  }
}
