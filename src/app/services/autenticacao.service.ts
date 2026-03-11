import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from './usuario.service';

@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
    private tokenKey = 'app_token';
    private userKey = 'app_user';

    constructor(private usuarioService: UsuarioService, private router: Router) { }

    registrar(usuario: Partial<Usuario>) {
        return this.usuarioService.criarUsuario(usuario);
    }

    login(email: string, senha: string) {
        return this.usuarioService.buscarPorEmailSenha(email, senha);
    }

    setSession(token: string, user: any) {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    clearSession() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    getUser() {
        const u = localStorage.getItem(this.userKey);
        return u ? JSON.parse(u) : null;
    }
}
