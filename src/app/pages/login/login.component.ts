import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  senha = '';
  erro: string | null = null;

  constructor(private router: Router, private usuarioService: UsuarioService, private auth: AutenticacaoService) {}

  login() {
    this.erro = null;
    if (!this.email || !this.senha) {
      this.erro = 'Preencha email e senha.';
      return;
    }

    this.usuarioService.buscarPorEmailSenha(this.email, this.senha).subscribe({
      next: (users) => {
        if (users && users.length > 0) {
          const user = users[0];
          const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
          const payload = btoa(JSON.stringify({ sub: user.id, email: user.email, iat: Date.now() }));
          const token = `${header}.${payload}.fake-signature`;
          this.auth.setSession(token, user);
          this.router.navigate(['/inicio']);
        } else {
          this.erro = 'Email ou senha inválidos.';
        }
      },
      error: () => {
        this.erro = 'Erro ao conectar com o servidor.';
      }
    });
  }
}
