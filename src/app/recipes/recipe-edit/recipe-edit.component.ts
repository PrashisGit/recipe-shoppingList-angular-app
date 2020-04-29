import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';


import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private storeSub: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }


  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        this.id = +params['id'];
        // tslint:disable-next-line: no-string-literal
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }

  onSubmit() {
    if (this.editMode) {
     // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
     this.store.dispatch(
      new RecipeActions.UpdateRecipe({
        index: this.id,
        newRecipe: this.recipeForm.value
      })
     );
    } else {
      //this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }

    this.onCancel();
  }

  onAddIngrident() {
    (this.recipeForm.get('ingridents') as FormArray).push(
      new FormGroup({
        // tslint:disable-next-line: object-literal-key-quotes
        'name': new FormControl(null, Validators.required),
        // tslint:disable-next-line: object-literal-key-quotes
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  onDeleteIngrident(index: number) {
    (this.recipeForm.get('ingridents') as FormArray).removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngridentsFArray = new FormArray([]);

    if (this.editMode) {
      //const recipe = this.recipeService.getRecipe(this.id);

     this.storeSub =  this.store.select('recipes').pipe(
        map(recipeState => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      ).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        // tslint:disable-next-line: no-string-literal
        if (recipe['ingridents']) {
          for (let ingrident of recipe.ingridents) {
            recipeIngridentsFArray.push(
              new FormGroup({
                // tslint:disable-next-line: object-literal-key-quotes
                'name': new FormControl(ingrident.name, Validators.required),
                // tslint:disable-next-line: object-literal-key-quotes
                'amount': new FormControl(ingrident.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)]
                  )
              })
            );
          }
        }
      });

    }
    this.recipeForm = new FormGroup({
      // tslint:disable-next-line: object-literal-key-quotes
      'name': new FormControl(recipeName, Validators.required),
      // tslint:disable-next-line: object-literal-key-quotes
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      // tslint:disable-next-line: object-literal-key-quotes
      'description': new FormControl(recipeDescription, Validators.required),
      // tslint:disable-next-line: object-literal-key-quotes
      'ingridents': recipeIngridentsFArray
    });
  }

  get control() {
    return (this.recipeForm.get('ingridents') as FormArray).controls;
  }
  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
