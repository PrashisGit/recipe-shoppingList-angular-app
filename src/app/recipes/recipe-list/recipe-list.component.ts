import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeService } from '../recipe.service';



@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipeChangeSub: Subscription;
  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
   /*this.recipeChangeSub =  this.store.select('recipes')
   .pipe(map(recipeState => recipeState.recipes))
   .subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });*/
    this.recipeChangeSub =  this.recipeService.recipeChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.recipeChangeSub.unsubscribe();
  }
}
