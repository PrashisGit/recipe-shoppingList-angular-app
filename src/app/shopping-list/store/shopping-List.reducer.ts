import { Action } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import { ADD_INGREDIENT} from './shopping-list.actions';

const initalState = {
  ingredients: [
    new Ingredient('Apple', 5),
    new Ingredient('Tomatoes', 10)
  ]
};

export function shoppingListReducer(state = initalState, action: Action){
  switch( action.type ){
    case ADD_INGREDIENT :
      return {
        ...state, // coppying old objects
        Ingredient: [...state.ingredients, action] // overwritng the ingridents: first copy old date and dn adding new ingrident
      };
  }
}
