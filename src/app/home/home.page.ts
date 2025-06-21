import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  public pokemons: any[] = [];

  constructor(private httpService: HttpService) {}
  ngOnInit() {
    this.getPokemons();
  } 
  getPokemons() {
      this.httpService.getPokemons().subscribe((data: any) => {
      const requests = data.results.map((poke: any) =>
        this.httpService.getPokemonDetails(poke.name)
      );
            forkJoin<any[]>(requests).subscribe((details: any[]) => {
        //imagens e informações dos pokémons
        this.pokemons = details.map(pokemon => ({
          id: pokemon.id,
          name: pokemon.name,
          height: pokemon.height,
          weight: pokemon.weight,
          base_experience: pokemon.base_experience,
          image: pokemon.sprites.other['official-artwork'].front_default,
          types: pokemon.types.map((t: any) => t.type.name),
          abilities: pokemon.abilities.map((a: any) => a.ability.name),
          stats: pokemon.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat
          }))
        }));
      });
    });
}
  showPokemon(id: number) {
    console.log('Pokemon ID:', id);
  }
}
