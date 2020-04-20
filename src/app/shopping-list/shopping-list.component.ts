import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  subscription: Subscription;
  constructor(private shoppingListService: ShoppingListService) { }


  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngridients();
    this.subscription =  this.shoppingListService.ingridentsChanged.subscribe(
      (inggriedents: Ingredient[]) => {
        this.ingredients = inggriedents;
      }
    );
  }

  onEditItem(index: number){
    this.shoppingListService.startedEdting.next(index);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

  }


}
