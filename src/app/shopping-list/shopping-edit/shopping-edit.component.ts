import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as ShoppingListActions from '../store/shopping-list.actions';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  constructor(
      private shoppingListService: ShoppingListService,
      private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
    ) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEdting.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngrident(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    );
  }

  onSubmit(form: NgForm){
    const value = form.value;
    const newInggredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.shoppingListService.updateIngrident(this.editedItemIndex,newInggredient);
    }else{
     // this.shoppingListService.addIngridents(newInggredient);
     // ingridient will add/dispatch using store ngrx

     this.store.dispatch(new ShoppingListActions.AddIngredient(newInggredient));

    }
    this.editMode = false;
    form.reset();

  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete(){
    this.onClear();
    this.shoppingListService.deleteIngrident(this.editedItemIndex);
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
