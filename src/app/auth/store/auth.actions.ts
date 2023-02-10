import { Action } from '@ngrx/store';

export const SIGNUP_START = '[Authentication] signup start';
export const LOGIN_START = '[Authentication] login start';
export const AUTHENTICATE_FAIL = '[Authentication] authenticate fail';
export const AUTHENTICATE_SUCCESS = '[Authentication] authenticate success';
export const CLEAR_ERROR = '[Authentication] clear error';
export const AUTO_LOGIN = '[Authentication] auto login';

export const LOGOUT = '[Authentication] logout';
export const AUTO_LOGOUT = '[Authentication] auto logout';

export class signupStart implements Action {
	readonly type = SIGNUP_START;

	constructor(public payload: { email: string; password: string }) {}
}

export class loginStart implements Action {
	readonly type = LOGIN_START;

	constructor(public payload: { email: string; password: string }) {}
}

export class authenticateSuccess implements Action {
	readonly type = AUTHENTICATE_SUCCESS;

	constructor(
		public payload: {
			email: string;
			userId: string;
			token: string;
			expirationDate: Date;
			redirect: boolean;
		}
	) {}
}

export class authenticateFail implements Action {
	readonly type = AUTHENTICATE_FAIL;

	constructor(public payload: string) {}
}

export class clearError implements Action {
	readonly type = CLEAR_ERROR;

	constructor() {}
}

export class autoLogin implements Action {
	readonly type = AUTO_LOGIN;

	constructor() {}
}

export class logout implements Action {
	readonly type = LOGOUT;

	constructor() {}
}

export class autoLogout implements Action {
	readonly type = AUTO_LOGOUT;

	constructor() {}
}

export type AuthActions =
	| signupStart
	| loginStart
	| authenticateSuccess
	| authenticateFail
	| clearError
	| autoLogin
	| logout
	| autoLogout;
