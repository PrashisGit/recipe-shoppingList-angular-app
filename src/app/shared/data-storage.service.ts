import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {}


  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://shoppig-recipe-app.firebaseio.com/recipes.json',
    recipes)
    .subscribe(response =>{
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://shoppig-recipe-app.firebaseio.com/recipes.json',
      )
      .pipe(
      map(recipes =>{
        return recipes.map(recipe =>{
          return { ...recipe, ingridents: recipe.ingridents ? recipe.ingridents : []};
        });
      }),
      tap(recipes => {
        console.log("tap  "+recipes);
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
