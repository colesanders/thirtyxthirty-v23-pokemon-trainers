import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { PokemonTrainersFacade } from '@thirty/core-state'
import { PokemonTrainer } from '@thirty/api-interfaces';
import { SnackBarService } from '@thirty/core-data';
import { Animations } from '../animations';


@Component({
  selector: 'thirty-pokemons',
  templateUrl: './pokemon-trainers.component.html',
  styleUrls: ['./pokemon-trainers.component.scss'],
  animations: Animations,
})
export class PokemonTrainersComponent implements OnInit {
  pokemonTrainers$: Observable<PokemonTrainer[]> = this.pokemonTrainersFacade.allPokemonTrainers$;
  pokemonTrainer$: Observable<PokemonTrainer> = this.pokemonTrainersFacade.selectedPokemonTrainer$;
  
  trainerEdit = true;
  detailOpen = false;

  constructor(
    private pokemonTrainersFacade: PokemonTrainersFacade,
    private router: Router,
    private snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this.pokemonTrainersFacade.loadPokemonTrainers();
    this.pokemonTrainersFacade.mutations$.subscribe((action: any) => this.refresh(action.type.split(' ')));
  }

  refresh(trigger: string){
    const snackBarMessage = 'Pokemon Trainer ' + trigger[1] + 'd';
    this.snackBarService.openSnackBar(snackBarMessage, 'Okay', 1000);
    this.pokemonTrainersFacade.loadPokemonTrainers();
  }

  focusDetail(){
    this.detailOpen = true;
  }

  focusoutDetail(){
    this.detailOpen = false;
  }

  select(pokemonTrainer: PokemonTrainer): void{
    this.pokemonTrainersFacade.selectPokemonTrainer(pokemonTrainer);
    this.focusDetail();
  }

  delete(pokemonTrainer: PokemonTrainer): void{
    this.pokemonTrainersFacade.deletePokemonTrainer(pokemonTrainer);
    this.cancel();
  }

  save(pokemonTrainer: PokemonTrainer): void{
    if(pokemonTrainer.id){
      this.pokemonTrainersFacade.updatePokemonTrainer(pokemonTrainer);
    }else {
      this.pokemonTrainersFacade.createPokemonTrainer(pokemonTrainer);
    }
  }

  cancel(): void{
    this.focusoutDetail();
    this.router.navigate(['/pokemon-trainers']);
    this.pokemonTrainersFacade.resetSelectedPokemonTrainer();
  }

}
