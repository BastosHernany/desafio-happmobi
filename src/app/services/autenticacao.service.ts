import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from './usuario.service';

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
    private chaveToken = 'app_token';
    private chaveUsuario = 'app_user';

    constructor(private usuarioService: UsuarioService, private router: Router) { }

    registrar(usuario: Partial<Usuario>) {
        return this.usuarioService.criarUsuario(usuario);
    }

    autenticar(email: string, senha: string) {
        return this.usuarioService.buscarPorEmailSenha(email, senha);
    }

    setSessao(token: string, user: any) {
        localStorage.setItem(this.chaveToken, token);
        localStorage.setItem(this.chaveUsuario, JSON.stringify(user));
    }

    limparSessao() {
        localStorage.removeItem(this.chaveToken);
        localStorage.removeItem(this.chaveUsuario);
    }

    estaAutenticado(): boolean {
        return !!localStorage.getItem(this.chaveToken);
    }

    obterUsuario() {
        const u = localStorage.getItem(this.chaveUsuario);
        return u ? JSON.parse(u) : null;
    }
}
