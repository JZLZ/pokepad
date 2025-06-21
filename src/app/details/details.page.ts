import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../services/http.service'; // Ajuste o caminho se necessário
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  pokemonName: string = '';
  pokemonData: any;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.pokemonName = this.route.snapshot.paramMap.get('name')!;
    this.loadPokemonDetails();
  }

  async loadPokemonDetails() {
    try {
      const pokemon = await this.httpService.getPokemonDetails(this.pokemonName).toPromise();

      const abilities = pokemon.abilities.map((a: any) => a.ability.name);
      const effect_entries: any[] = [];

      for (const abilityName of abilities) {
        try {
          const abilityData = await this.httpService.getAbilityDetails(abilityName).toPromise();
          const effect = abilityData.effect_entries.find((e: any) => e.language.name === 'en');
          if (effect) {
            effect_entries.push({
              ability: abilityName,
              effect: effect.effect
            });
          }
        } catch (err) {
          console.warn(`Failed to fetch effect for ${abilityName}`, err);
        }
      }

      this.pokemonData = {
        name: pokemon.name,
        base_experience: pokemon.base_experience,
        height: pokemon.height,
        weight: pokemon.weight,
        id: pokemon.id,
        image: pokemon.sprites.other['official-artwork'].front_default,
        types: pokemon.types.map((t: any) => t.type.name),
        abilities,
        stats: pokemon.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat
        })),
        effect_entries
      };

      console.log(this.pokemonData);

    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
  }
}
