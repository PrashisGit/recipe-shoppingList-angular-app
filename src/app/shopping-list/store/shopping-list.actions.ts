import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT_ITEM = 'START_EDIT_ITEM';
export const STOP_EDIT_ITEM = 'STOP_EDIT_ITEM';

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;

  constructor(public payload: Ingredient) {}

}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;

  constructor( public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor( public payload: Ingredient) {}

}
export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;

}
export class StartEditItem implements Action {
  readonly type = START_EDIT_ITEM;
  constructor( public payload: number) {
  }
}
export class StopEditItem implements Action {
  readonly type = STOP_EDIT_ITEM;
}

export type ShoppinListActionsType =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEditItem
  | StopEditItem;
