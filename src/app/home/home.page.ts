import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';

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
    this.httpService.getPokemons().subscribe((data: any) => this.pokemons = data.results);
  }
  
}
