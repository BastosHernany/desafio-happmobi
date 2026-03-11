import { Component } from '@angular/core';
import { CardCarroComponent } from '../../components/card-carro/card-carro.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CardCarroComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {

}
