import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private dataStorageService: DataStorageService,
              private recipeService: RecipeService){}

  resolve(route: import("@angular/router").ActivatedRouteSnapshot,
          state: import("@angular/router").RouterStateSnapshot): Recipe[] |
          import("rxjs").Observable<Recipe[]> |
          Promise<Recipe[]> {
            const recipes = this.recipeService.getRecipes();
            if(recipes.length === 0){
              return this.dataStorageService.fetchRecipes();
            }else{
              return recipes;
            }

  }

}
