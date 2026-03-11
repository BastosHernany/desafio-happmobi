
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Carro, CarroService } from '../../services/carro.service';
import { CardCarroComponent } from '../card-carro/card-carro.component';

@Component({
  selector: 'app-buscar-carro',
  standalone: true,
  imports: [CommonModule, CardCarroComponent],
  templateUrl: './buscar-carro.component.html',
  styleUrl: './buscar-carro.component.css'
})
export class BuscarCarroComponent {
  carros$: Observable<Carro[]>;

  constructor(private carroService: CarroService) {
    this.carros$ = this.carroService.listarCarros();
  }
}
