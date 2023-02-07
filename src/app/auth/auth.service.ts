import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export type AuthResponseData = {
	kind: string;
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
	registered?: boolean;
};

type AuthUserData = {
	email: string;
	password: string;
};

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user = new BehaviorSubject<User>(null);
	private databaseUrl = environment.firebasebaseBaseUrl;
	private apiKey = environment.firebaseApiKey;
	private tokenExpirationTimer: any;

	constructor(private http: HttpClient, private router: Router) {}

	signUp(userData: AuthUserData) {
		return this.http
			.post<AuthResponseData>(`${this.databaseUrl}accounts:signUp?${this.apiKey}`, {
				...userData,
				returnSecureToken: true
			})
			.pipe(
				catchError(this.handleError),
				tap(respData => {
					this.handleAuthentication(
						respData.localId,
						respData.email,
						respData.idToken,
						parseInt(respData.expiresIn)
					);
				})
			);
	}

	login(userData: AuthUserData) {
		return this.http
			.post<AuthResponseData>(`${this.databaseUrl}accounts:signInWithPassword?${this.apiKey}`, {
				...userData,
				returnSecureToken: true
			})
			.pipe(
				catchError(this.handleError),
				tap(respData => {
					this.handleAuthentication(
						respData.localId,
						respData.email,
						respData.idToken,
						parseInt(respData.expiresIn)
					);
				})
			);
	}

	autoLogin() {
		const userData: {
			email: string;
			id: string;
			_token: string;
			_tokenExpirationDate: string;
		} = JSON.parse(localStorage.getItem('userData'));

		if (!userData) {
			return;
		}

		const loadedUser = new User(
			userData.id,
			userData.email,
			userData._token,
			new Date(userData._tokenExpirationDate)
		);

		if (loadedUser.token) {
			this.user.next(loadedUser);
			const expirationDuration =
				new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
			this.autoLogout(expirationDuration);
		}
	}

	logout() {
		this.user.next(null);
		this.router.navigate(['/auth']);
		localStorage.removeItem('userData');

		if (this.tokenExpirationTimer) {
			clearTimeout(this.tokenExpirationTimer);
		}
	}

	autoLogout(expirationDuration: number) {
		this.tokenExpirationTimer = setTimeout(() => {
			this.logout();
		}, expirationDuration);
	}

	private handleAuthentication(userId: string, email: string, token: string, expiresIn: number) {
		const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

		const user = new User(userId, email, token, expirationDate);
		this.user.next(user);
		this.autoLogout(expiresIn * 1000);
		localStorage.setItem('userData', JSON.stringify(user));
	}

	private handleError(errorRes: HttpErrorResponse) {
		let errorMessage = 'Sorry, something went wrong!';

		if (!errorRes?.error?.error) {
			return throwError(errorMessage);
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

		return throwError(errorMessage);
	}
}
