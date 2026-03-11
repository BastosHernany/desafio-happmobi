import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reserva {
  id?: number | string;
  usuarioId: string | number;
  carroId: string | number;
  dataInicio?: string;
  dataFim?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private baseUrl = 'http://localhost:3000/reservas';

  constructor(private http: HttpClient) {}

  listarPorUsuario(usuarioId: string | number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}?usuarioId=${encodeURIComponent(String(usuarioId))}`);
  }

  listarTodas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.baseUrl);
  }

  criarReserva(payload: Partial<Reserva>) {
    return this.http.post<Reserva>(this.baseUrl, payload);
  }

  cancelarReserva(id: string | number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
