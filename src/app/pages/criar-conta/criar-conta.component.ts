import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';

@Component({
  selector: 'app-criar-conta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './criar-conta.component.html',
  styleUrl: './criar-conta.component.css'
})
export class CriarContaComponent {
  nome = '';
  dataNascimento = '';
  email = '';
  senha = '';
  confirmaSenha = '';
  imagemUrl = '';

  erro = '';
  sucesso = '';

  constructor(private usuarioService: UsuarioService, private auth: AutenticacaoService, private router: Router) {}

  validarEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  cadastrar() {
    this.erro = '';
    if (!this.nome || !this.email || !this.senha) {
      this.erro = 'Preencha os campos obrigatórios.';
      return;
    }
    if (!this.validarEmail(this.email)) {
      this.erro = 'Email inválido.';
      return;
    }
    if (this.senha.length < 6) {
      this.erro = 'Senha deve ter no mínimo 6 caracteres.';
      return;
    }
    if (this.senha !== this.confirmaSenha) {
      this.erro = 'As senhas não conferem.';
      return;
    }

    const payload = {
      nome: this.nome,
      dataNascimento: this.dataNascimento,
      email: this.email,
      senha: this.senha,
      imagemUrl: this.imagemUrl || undefined,
    };

    this.usuarioService.criarUsuario(payload).subscribe({
      next: (u) => {
        // não autentica automaticamente — redireciona ao login para que o usuário faça login manualmente
        this.sucesso = 'Conta criada com sucesso. Faça login para acessar sua conta.';
        setTimeout(() => this.router.navigate(['/']), 900);
      },
      error: () => {
        this.erro = 'Erro ao criar conta.';
      },
    });
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}
