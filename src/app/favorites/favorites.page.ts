import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpService } from '../services/http.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favoritePokemons: any[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  async loadFavorites() {
    const favoriteNames: string[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.favoritePokemons = [];

    for (const name of favoriteNames) {
      try {
        const pokemon = await this.httpService.getPokemonDetails(name).toPromise();

        this.favoritePokemons.push({
          name: pokemon.name,
          id: pokemon.id,
          image: pokemon.sprites.other['official-artwork'].front_default,
          types: pokemon.types.map((t: any) => t.type.name),
        });
      } catch (error) {
        console.error(`Erro ao carregar ${name}:`, error);
      }
    }
  }
}
