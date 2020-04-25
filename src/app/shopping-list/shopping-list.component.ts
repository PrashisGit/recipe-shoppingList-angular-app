import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-List.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  // ingredients: Ingredient[];
  // above code comment for changes of using store
  ingredients: Observable<{ingredients: Ingredient[]}>;
  // subscription: Subscription;
  constructor(
      private store: Store<fromShoppingList.AppState>
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

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEditItem(index));
  }

  ngOnDestroy(): void {
   // this.subscription.unsubscribe();
   // no need for unsubscribe as we change code from subject to Store

  }


}
