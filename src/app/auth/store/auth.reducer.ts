import { User } from '../user.model';
import * as authActions from './auth.actions';

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
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
        authError: null,
        user: newUser,
        loading: false
      };
    case authActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case authActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case authActions.LOGIN_FAIL:
      return {
        ...state,
        authError: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
