import * as AuthActions from './auth.actions';
import { User } from '../user.model';

export type stateType = {
	user: User;
	authError: string;
	loading: boolean;
};

const initialState: stateType = {
	user: null,
	authError: null,
	loading: false
};

export function authReducer(state: stateType = initialState, action: AuthActions.AuthActions) {
	switch (action.type) {
		case AuthActions.LOGIN_START:
		case AuthActions.SIGNUP_START:
			return {
				...state,
				authError: null,
				loading: true
			};
		case AuthActions.AUTHENTICATE_SUCCESS:
			const { userId, email, token, expirationDate } = action.payload;
			const user = new User(userId, email, token, expirationDate);

			return {
				...state,
				authError: null,
				user,
				loading: false
			};
		case AuthActions.AUTHENTICATE_FAIL:
			return {
				...state,
				authError: action.payload,
				loading: false
			};
		case AuthActions.LOGOUT:
			return {
				...state,
				user: null
			};
		case AuthActions.CLEAR_ERROR:
			return {
				...state,
				authError: null
			};

		// case AuthActions.AUTO_LOGIN:
		// 	return state;
		// case AuthActions.AUTO_LOGOUT:
		// 	return state;
		default:
			return state;
	}
}
