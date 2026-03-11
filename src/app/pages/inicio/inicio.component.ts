import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../components/menu/menu.component';
import { CardCarroComponent } from '../../components/card-carro/card-carro.component';
import { Observable } from 'rxjs';
import { Carro, CarroService } from '../../services/carro.service';
import { ArrastarScrollDirective } from '../../directives/drag-scroll.directive';
import { RouterModule } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent, CardCarroComponent, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  carros$: Observable<Carro[]>;

  usuario: Usuario | null = null;
  nomeUsuario = 'Usuário';
  fotoUsuario = 'assets/avatar.png';

  mostrandoModalAdicionar = false;
  sucessoMensagem = '';
  novoVeiculo: Partial<Carro> = { name: '', year: '', type: '', engine: '', size: '', imageUrl: '' };

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

  constructor(private carroService: CarroService, private auth: AutenticacaoService) {
    this.carros$ = this.carroService.listarCarros();
    const u = this.auth.getUser();
    if (u) {
      this.usuario = u as Usuario;
      this.nomeUsuario = this.usuario.nome || 'Usuário';
      this.fotoUsuario = this.usuario.imagemUrl || 'assets/avatar.png';
    }
  }

  abrirModalAdicionar() {
    this.mostrandoModalAdicionar = true;
    this.sucessoMensagem = '';
  }

  fecharModalAdicionar() {
    this.mostrandoModalAdicionar = false;
    this.novoVeiculo = { name: '', year: '', type: '', engine: '', size: '', imageUrl: '' };
  }

  salvarCarroInicio() {
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
        this.sucessoMensagem = 'Novo veiculo cadastrado com sucesso';
        // atualizar lista
        this.carros$ = this.carroService.listarCarros();
        this.mostrandoModalAdicionar = false;
        setTimeout(() => (this.sucessoMensagem = ''), 3500);
      },
      error: () => {
        this.sucessoMensagem = 'Erro ao cadastrar veículo';
        setTimeout(() => (this.sucessoMensagem = ''), 3500);
      }
    });
  }

}
