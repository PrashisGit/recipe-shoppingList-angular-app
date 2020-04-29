import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as RecipesActions from '../store/recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>('https://shopping-recipe-univarsal.firebaseio.com/recipes.json',
      );
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingridents: recipe.ingridents ? recipe.ingridents : []};
      });
    }),
    map(recipes => {
      return  new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({dispatch:false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipeState]) => {
      return this.http.put('https://shopping-recipe-univarsal.firebaseio.com/recipes.json',
      recipeState.recipes);
    })
  );
  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {}
}
