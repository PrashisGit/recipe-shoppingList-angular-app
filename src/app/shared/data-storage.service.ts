import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap} from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private store: Store<fromApp.AppState>
              ) {}


  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://shopping-recipe-ngrx.firebaseio.com/recipes.json',
    recipes)
    .subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://shopping-recipe-ngrx.firebaseio.com/recipes.json',
      )
      .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingridents: recipe.ingridents ? recipe.ingridents : []};
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
        //this.store.dispatch(new RecipesActions.SetRecipes(recipes));
      })
    );
  }
}
