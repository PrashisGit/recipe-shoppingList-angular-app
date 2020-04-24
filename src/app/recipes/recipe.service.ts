import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService{

recipeChanged = new Subject<Recipe[]>();
 /* private recipes: Recipe[] = [
    new Recipe('Vada Pav',
     'Super Tasty, Indian Burger',
     'https://upload.wikimedia.org/wikipedia/commons/4/4e/Vada_Pav-Indian_street_food.JPG',
     [
       new Ingredient('Chili Paper',2),
       new Ingredient('Garlic',3),
       new Ingredient('Deep fried mashed potato patties',1),
       new Ingredient('Ginger',1),
       new Ingredient('Bun',2)
      ]),
    new Recipe('Test Name 2',
    'Test Description 2',
    'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
    [
      new Ingredient('onion ',2),
       new Ingredient('Bun',1),
       new Ingredient('Tomatoes',2)
    ])
  ];
  */
  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) {}

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }
  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(id: number){
    return this.recipes.slice()[id];
  }

  addIngrideintsToShoppingList(ingridents: Ingredient[]){
    // this.shoppingListService.addIngrideintsToRecipe(ingridents);
    // using store insted
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingridents));
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index,1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
