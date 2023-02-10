import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environment/environment';
import * as AuthActions from './auth.actions';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

const keyLocalStorageUser = 'userData';

export type AuthResponseData = {
	kind: string;
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
	registered?: boolean;
};

const handleAuthentication = (userId: string, email: string, token: string, expiresIn: number) => {
	const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

	const user = new User(userId, email, token, expirationDate);
	localStorage.setItem(keyLocalStorageUser, JSON.stringify(user));

	return new AuthActions.authenticateSuccess({
		userId: userId,
		email: email,
		token: token,
		expirationDate: expirationDate,
		redirect: true
	});
};

const handleError = (errorRes: any) => {
	let errorMessage = 'Sorry, something went wrong!';

	if (!errorRes?.error?.error) {
		return of(new AuthActions.authenticateFail(errorMessage));
	}

	switch (errorRes.error.error.message) {
		case 'EMAIL_EXISTS':
			errorMessage = 'This email exists already!';
			break;
		case 'OPERATION_NOT_ALLOWED':
			errorMessage = "We are sorry, but this operation doesn't exists.";
			break;
		case 'TOO_MANY_ATTEMPTS_TRY_LATER':
			errorMessage = 'We are sorry, but too many requests!';
			break;
		case 'EMAIL_NOT_FOUND':
			errorMessage = "We are sorry, but we can't find your useraccount";
			break;
		case 'INVALID_PASSWORD':
			errorMessage = 'We are sorry, but your password is wrong';
			break;
		case 'USER_DISABLED':
			errorMessage =
				'We are sorry, but your account is disabled, please get in touch with an admin';
			break;
		default:
			break;
	}

	return of(new AuthActions.authenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
	@Effect({ dispatch: false })
	authRedirect = this.actions$.pipe(
		ofType(AuthActions.AUTHENTICATE_SUCCESS),
		tap((authSuccessAction: AuthActions.authenticateSuccess) => {
			if (authSuccessAction.payload.redirect) {
				this.router.navigate(['/']);
			}
		})
	);
	@Effect({ dispatch: false })
	authLogout = this.actions$.pipe(
		ofType(AuthActions.LOGOUT),
		tap(() => {
			this.authService.clearLogoutTimer();
			localStorage.removeItem(keyLocalStorageUser);
			this.router.navigate(['/auth']);
		})
	);
	@Effect()
	authAutoLogin = this.actions$.pipe(
		ofType(AuthActions.AUTO_LOGIN),
		map(() => {
			const userData: {
				email: string;
				id: string;
				_token: string;
				_tokenExpirationDate: string;
			} = JSON.parse(localStorage.getItem(keyLocalStorageUser));

			if (!userData) {
				return { type: 'dummy' };
			}

			const loadedUser = new User(
				userData.id,
				userData.email,
				userData._token,
				new Date(userData._tokenExpirationDate)
			);

			if (loadedUser.token) {
				const expirationDuration =
					new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
				this.authService.setLogoutTimer(expirationDuration);

				return new AuthActions.authenticateSuccess({
					userId: loadedUser.id,
					email: loadedUser.email,
					token: loadedUser.token,
					expirationDate: new Date(userData._tokenExpirationDate),
					redirect: false
				});
			}
			return { type: 'dummy' };
		})
	);
	private databaseUrl = environment.firebasebaseBaseUrl;
	private apiKey = environment.firebaseApiKey;
	@Effect()
	authSignup = this.actions$.pipe(
		ofType(AuthActions.SIGNUP_START),
		switchMap((signupAction: AuthActions.signupStart) => {
			return this.http
				.post<AuthResponseData>(`${this.databaseUrl}accounts:signUp?${this.apiKey}`, {
					email: signupAction.payload.email,
					password: signupAction.payload.password,
					returnSecureToken: true
				})
				.pipe(
					tap(resData => {
						this.authService.setLogoutTimer(parseInt(resData.expiresIn) * 1000);
					}),
					map(resData => {
						const { localId: userId, email, idToken: token, expiresIn } = resData;
						return handleAuthentication(userId, email, token, parseInt(expiresIn));
					}),
					catchError(errorRes => {
						return handleError(errorRes);
					})
				);
		})
	);
	@Effect()
	authLogin = this.actions$.pipe(
		ofType(AuthActions.LOGIN_START),
		switchMap((authData: AuthActions.loginStart) => {
			return this.http
				.post<AuthResponseData>(`${this.databaseUrl}accounts:signInWithPassword?${this.apiKey}`, {
					email: authData.payload.email,
					password: authData.payload.password,
					returnSecureToken: true
				})
				.pipe(
					tap(resData => {
						this.authService.setLogoutTimer(parseInt(resData.expiresIn) * 1000);
					}),
					map(resData => {
						const { localId: userId, email, idToken: token, expiresIn } = resData;
						return handleAuthentication(userId, email, token, parseInt(expiresIn));
					}),
					catchError(errorRes => {
						return handleError(errorRes);
					})
				);
		})
	);

	constructor(
		private http: HttpClient,
		private actions$: Actions,
		private router: Router,
		private authService: AuthService
	) {}
}
