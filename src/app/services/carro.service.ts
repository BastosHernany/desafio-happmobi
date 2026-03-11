import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Carro {
    id?: number | string;
    name: string;
    year: string;
    type: string;
    engine: string;
    size: string;
    imagem?: string;
    imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CarroService {

    private baseUrl = 'http://localhost:3001/carros';

    constructor(private http: HttpClient) { }

    listarCarros(): Observable<Carro[]> {
        return this.http.get<Carro[]>(this.baseUrl);
    }

    obterPorId(id: number | string): Observable<Carro> {
        return this.http.get<Carro>(`${this.baseUrl}/${id}`);
    }

    criarCarro(payload: Partial<Carro>) {
        return this.http.post<Carro>(this.baseUrl, payload);
    }

    atualizarCarro(id: number | string, payload: Partial<Carro>) {
        return this.http.put<Carro>(`${this.baseUrl}/${id}`, payload);
    }

    deletarCarro(id: number | string) {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
