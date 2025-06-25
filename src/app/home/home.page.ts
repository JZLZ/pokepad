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
  public filteredPokemons: any[] = [];
  public favorites: number[] = [];

  public searchTerm: string = '';

  private limit = 100;    // quantos pokemons carregar por vez
  private offset = 0;    // a partir de qual índice carregar
  public loading = false;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loadFavorites();
    this.loadPokemons();
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

  loadPokemons() {
    this.loading = true;
    this.httpService.getPokemons(this.limit, this.offset).subscribe((data: any) => {
      const requests = data.results.map((poke: any) =>
        this.httpService.getPokemonDetails(poke.name)
      );
      forkJoin<any[]>(requests).subscribe((details: any[]) => {
        const newPokemons = details.map(pokemon => ({
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

        this.pokemons = [...this.pokemons, ...newPokemons];
        this.applyFilter();
        this.loading = false;
      }, error => {
        console.error('Erro ao buscar detalhes dos pokemons', error);
        this.loading = false;
      });
    }, error => {
      console.error('Erro ao buscar lista de pokemons', error);
      this.loading = false;
    });
  }

  loadMorePokemons() {
    this.offset += this.limit; // pula para o próximo "bloco"
    this.loadPokemons();
  }

  // Aplica filtro conforme o searchTerm na lista pokemons
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredPokemons = this.pokemons;
    } else {
      this.filteredPokemons = this.pokemons.filter(p =>
        p.name.toLowerCase().includes(term)
      );
    }
  }

  // Método para ser chamado no evento de input da searchbar
  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.applyFilter();
  }

  showPokemon(id: number) {
    console.log('Pokemon ID:', id);
  }
}
