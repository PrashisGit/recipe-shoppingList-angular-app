import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  //ingredients: Ingredient[];
  // above code comment for changes of using store
  ingredients: Observable<{ingredients: Ingredient[]}>;
  // subscription: Subscription;
  constructor(
      private shoppingListService: ShoppingListService,
      private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
    ) { }


  ngOnInit() {

    /*this.ingredients = this.shoppingListService.getIngridients();
    this.subscription =  this.shoppingListService.ingridentsChanged.subscribe(
      (inggriedents: Ingredient[]) => {
        this.ingredients = inggriedents;
      }
    );*/
    // above code changes to store
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number){
    this.shoppingListService.startedEdting.next(index);
  }

  ngOnDestroy(): void {
   // this.subscription.unsubscribe();
   // no need for unsubscribe as we change code from subject to Store

  }


}
