import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  getPokemons () {
    return this.http.get('https://pokeapi.co/api/v2/pokemon/');
  }
  getPokemonDetails(nameOrId: string): Observable<any> {
  return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
  }
  getAbilityDetails(abilityName: string) {
  return this.http.get<any>(`https://pokeapi.co/api/v2/ability/${abilityName}`);
  }

}

