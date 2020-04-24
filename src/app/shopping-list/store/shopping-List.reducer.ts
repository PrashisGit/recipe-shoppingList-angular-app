import { Action } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const initalState = {
  ingredients: [
    new Ingredient('Apple', 5),
    new Ingredient('Tomatoes', 10)
  ]
};

export function shoppingListReducer(
  state = initalState,
  action: ShoppingListActions.AddIngredient
  ) {

  switch ( action.type ) {
    case ShoppingListActions.ADD_INGREDIENT :
      return {
        ...state, // coppying old objects
        ingredients: [...state.ingredients, action.payload] // overwritng the ingridents: first copy old date and dn adding new ingrident
      };
    default:
      return state;
  }
}
