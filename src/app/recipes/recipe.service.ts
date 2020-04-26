import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import { Ingredient } from '../shared/ingredient.model';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {

recipeChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }
  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes.slice()[id];
  }

  addIngrideintsToShoppingList(ingridents: Ingredient[]) {
    // this.shoppingListService.addIngrideintsToRecipe(ingridents);
    // using store insted
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingridents));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
