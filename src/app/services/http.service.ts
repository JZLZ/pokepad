import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  // Agora aceita limit e offset para controlar quantidade e página
  getPokemons(limit: number = 20, offset: number = 0): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(nameOrId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }

  getAbilityDetails(abilityName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ability/${abilityName}`);
  }

}
