import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carro, CarroService } from '../../services/carro.service';


@Component({
  selector: 'app-card-carro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-carro.component.html',
})

export class CardCarroComponent implements OnInit {
  @Input() carro?: Carro;
  @Input() id?: number;

  carregando = false;
  erro = false;

  constructor(private carroService: CarroService) {}

  ngOnInit(): void {
    if (!this.carro && this.id) {
      this.carregando = true;
      this.carroService.obterPorId(this.id).subscribe({
        next: (c) => {
            this.carro = c;
            this.carregando = false;
          },
          error: () => {
            this.carregando = false;
            this.erro = true;
          },
      });
    }
  }
}
