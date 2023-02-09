import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
	@ViewChild('authForm')
	authForm: NgForm;
	@ViewChild(PlaceholderDirective)
	alertHost: PlaceholderDirective;
	isLoginMode = true;
	isLoading = false;
	error: string | null = null;
	private closeSub: Subscription;
	private storeSub: Subscription;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private store: Store<fromApp.appState>
	) {}

	ngOnInit() {
		this.storeSub = this.store.select('auth').subscribe(authState => {
			this.isLoading = authState.loading;
			this.error = authState.authError;

			if (this.error) {
				this.showErrorAlert(this.error);
			}
		});
	}

	ngOnDestroy() {
		if (this.closeSub) {
			this.closeSub.unsubscribe();
		}
		if (this.storeSub) {
			this.storeSub.unsubscribe();
		}
	}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}

	onSubmit() {
		const { email, password } = this.authForm.value;
		if (!this.authForm.valid) {
			return;
		}

		if (this.isLoginMode) {
			this.store.dispatch(new AuthActions.loginStart({ email: email, password: password }));
		} else {
			this.store.dispatch(new AuthActions.signupStart({ email: email, password: password }));
		}

		this.authForm.reset();
	}

	onHandleError() {
		this.store.dispatch(new AuthActions.clearError());
	}

	private showErrorAlert(errorRes: string) {
		const alertComponentFactory =
			this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

		const hostViewContainerRef = this.alertHost.viewContainerRef;
		hostViewContainerRef.clear();

		const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

		componentRef.instance.message = errorRes;
		this.closeSub = componentRef.instance.close.subscribe(() => {
			this.closeSub.unsubscribe();
			hostViewContainerRef.clear();
		});
	}
}
