import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType} from '@ngrx/effects';

import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';
import { take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private store: Store<fromApp.AppState>,
              private actions$: Actions) {}

  resolve(route: import('@angular/router').ActivatedRouteSnapshot,
          state: import('@angular/router').RouterStateSnapshot): Recipe[] |
          import('rxjs').Observable<Recipe[]> |
          Promise<Recipe[]> {
            // const recipes = this.recipeService.getRecipes();
            // if (recipes.length === 0) {
            //   return this.dataStorageService.fetchRecipes();
            // } else {
            //   return recipes;
            // }
            this.store.dispatch(new RecipeActions.FetchRecipes());
            return this.actions$.pipe(
              ofType(RecipeActions.SET_RECIPES),
              take(1)
            );

  }

}
