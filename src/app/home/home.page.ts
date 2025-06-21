import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  public pokemons: any[] = [];
  public favorites: number[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loadFavorites();
    this.getPokemons();
  }

  loadFavorites() {
    const favs = localStorage.getItem('pokemonFavorites');
    this.favorites = favs ? JSON.parse(favs) : [];
  }

  saveFavorites() {
    localStorage.setItem('pokemonFavorites', JSON.stringify(this.favorites));
  }

  toggleFavorite(pokemonId: number) {
    const index = this.favorites.indexOf(pokemonId);

    if (index > -1) {
      // Já é favorito, remove
      this.favorites.splice(index, 1);
    } else {
      // Não é favorito, adiciona
      this.favorites.push(pokemonId);
    }

    this.saveFavorites();
  }

  isFavorite(pokemonId: number): boolean {
    return this.favorites.includes(pokemonId);
  }

  getPokemons() {
    this.httpService.getPokemons().subscribe((data: any) => {
      const requests = data.results.map((poke: any) =>
        this.httpService.getPokemonDetails(poke.name)
      );
      forkJoin<any[]>(requests).subscribe((details: any[]) => {
        this.pokemons = details.map(pokemon => ({
          id: pokemon.id,
          name: pokemon.name,
          height: pokemon.height / 10,
          weight: pokemon.weight / 10,
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
