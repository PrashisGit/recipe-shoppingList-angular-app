import {Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';


export class ShoppingListService {


  ingridentsChanged = new Subject<Ingredient[]>();
  startedEdting = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomatoes', 10)
  ];

  getIngridients(){
    return this.ingredients.slice();
  }

  getIngrident(index: number){
    return this.ingredients[index];
  }

  addIngridents(ingrident: Ingredient){
    this.ingredients.push(ingrident);
    this.ingridentsChanged.next(this.ingredients.slice());
  }

  addIngrideintsToRecipe(ingredients: Ingredient[]){
   this.ingredients.push(...ingredients);
   this.ingridentsChanged.next(this.ingredients.slice());
  }

  updateIngrident(index: number, newIngrident: Ingredient){
    this.ingredients[index] = newIngrident;
    this.ingridentsChanged.next(this.ingredients.slice());
  }

  deleteIngrident(index: number){
    this.ingredients.splice(index,1);
    this.ingridentsChanged.next(this.ingredients.slice());
  }
}
