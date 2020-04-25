import { User } from '../user.model';
import * as authActions from './auth.actions';

export interface State {
  user: User;
}

const initialState: State = {
  user: null
};

export function authReducer(state = initialState, action: authActions.AuthActionsType) {
  switch (action.type) {
    case authActions.LOGIN:
      const newUser = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate);
      return {
        ...state,
        user: newUser
      };
    case authActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}
