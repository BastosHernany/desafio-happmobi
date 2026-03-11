import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number | string;
  nome: string;
  dataNascimento?: string;
  email: string;
  senha: string;
  imagemUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private baseUrl = 'http://localhost:3001/usuarios';

  constructor(private http: HttpClient) {}

  criarUsuario(payload: Partial<Usuario>) {
    return this.http.post<Usuario>(this.baseUrl, payload);
  }

  buscarPorEmailSenha(email: string, senha: string): Observable<Usuario[]> {
    // json-server supports query params
    return this.http.get<Usuario[]>(`${this.baseUrl}?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);
  }
}
