import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import { map, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  recipe: Recipe;
  id: number;
  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    /*this.route.params.subscribe(
      (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        this.id = +params['id'];
        console.log(this.id);
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );*/
    this.route.params.pipe(
      map(params => {
        return +params['id'];
      }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipeState => {
        return recipeState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })
    ).subscribe(recipe => {
      this.recipe = recipe;
    });
  }


  onAddToShoppingList() {

    this.recipeService.addIngrideintsToShoppingList(this.recipe.ingridents);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
