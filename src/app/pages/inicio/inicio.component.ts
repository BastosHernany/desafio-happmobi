import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { CardCarroComponent } from '../../components/card-carro/card-carro.component';
import { Observable } from 'rxjs';
import { Carro, CarroService } from '../../services/carro.service';
import { ArrastarScrollDirective } from '../../directives/drag-scroll.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MenuComponent, CardCarroComponent, ArrastarScrollDirective, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  carros$: Observable<Carro[]>;

  constructor(private carroService: CarroService) {
    this.carros$ = this.carroService.listarCarros();
  }

}
