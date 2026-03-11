import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carro, CarroService } from '../../services/carro.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-card-carro',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgIf],
  templateUrl: './card-carro.component.html',
})
export class CardCarroComponent implements OnInit {
  @Input() carro?: Carro;
  @Input() id?: number;

  loading = false;
  erro = false;

  constructor(private carroService: CarroService) {}

  ngOnInit(): void {
    if (!this.carro && this.id) {
      this.loading = true;
      this.carroService.obterPorId(this.id).subscribe({
        next: (c) => {
          this.carro = c;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.erro = true;
        },
      });
    }
  }
}
