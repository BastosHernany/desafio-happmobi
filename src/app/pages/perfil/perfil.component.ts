
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { MenuComponent } from "../../components/menu/menu.component";
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MenuComponent, HeaderComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  usuario: Usuario | null = null;

  nome = '';
  dataNascimento = '';
  email = '';
  senha = '';
  imagemUrl = '';

  editando = false;
  modalConfirmar = false;
  modalExcluir = false;
  carregando = false;
  mensagem = '';

  constructor(private auth: AutenticacaoService, private usuarioService: UsuarioService, private router: Router) {
    const u = this.auth.getUser();
    if (u) {
      this.usuario = u as Usuario;
      this.nome = this.usuario.nome || '';
      this.dataNascimento = this.usuario.dataNascimento || '';
      this.email = this.usuario.email || '';
      this.senha = this.usuario.senha || '';
      this.imagemUrl = this.usuario.imagemUrl || '';
    }
  }

  ativarEdicao() {
    this.editando = true;
  }

  solicitarSalvar() {
    this.modalConfirmar = true;
  }

  confirmarSalvar(confirm: boolean) {
    this.modalConfirmar = false;
    if (!confirm) return;
    if (!this.usuario) return;

    // validações simples
    if (!this.nome || !this.email || !this.senha) {
      this.mensagem = 'Preencha nome, email e senha.';
      return;
    }

    this.carregando = true;
    const payload: Partial<Usuario> = {
      nome: this.nome,
      dataNascimento: this.dataNascimento,
      email: this.email,
      senha: this.senha,
      imagemUrl: this.imagemUrl || undefined
    };

    this.usuarioService.atualizarUsuario(this.usuario.id!, payload).subscribe({
      next: (u) => {
        this.carregando = false;
        this.editando = false;
        this.usuario = u;
        this.auth.setSession(localStorage.getItem('app_token') || '', u);
        this.mensagem = 'Dados atualizados com sucesso.';
        setTimeout(() => (this.mensagem = ''), 3000);
      },
      error: () => {
        this.carregando = false;
        this.mensagem = 'Erro ao atualizar dados.';
      }
    });
  }

  solicitarExcluir() {
    this.modalExcluir = true;
  }

  confirmarExcluir(confirm: boolean) {
    this.modalExcluir = false;
    if (!confirm) return;
    if (!this.usuario) return;

    this.carregando = true;
    this.usuarioService.deletarUsuario(this.usuario.id!).subscribe({
      next: () => {
        this.carregando = false;
        this.auth.clearSession();
        this.router.navigate(['/']);
      },
      error: () => {
        this.carregando = false;
        this.mensagem = 'Erro ao excluir conta.';
      }
    });
  }
}
