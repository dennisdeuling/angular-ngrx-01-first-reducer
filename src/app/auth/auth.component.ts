import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
	@ViewChild('authForm')
	authForm: NgForm;
	@ViewChild(PlaceholderDirective)
	alertHost: PlaceholderDirective;
	isLoginMode = true;
	isLoading = false;
	error: string | null = null;
	private closeSub: Subscription;

	constructor(
		private authService: AuthService,
		private router: Router,
		private componentFactoryResolver: ComponentFactoryResolver
	) {}

	ngOnDestroy() {
		if (this.closeSub) {
			this.closeSub.unsubscribe();
		}
	}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}

	onSubmit() {
		const userData = this.authForm.value;
		if (!this.authForm.valid) {
			return;
		}

		this.isLoading = true;

		let authObs: Observable<AuthResponseData>;

		if (this.isLoginMode) {
			authObs = this.authService.login(userData);
		} else {
			authObs = this.authService.signUp(userData);
		}

		authObs.subscribe(
			response => {
				this.isLoading = false;
				this.router.navigate(['/recipes']);
			},
			errorRes => {
				this.error = errorRes;
				this.showErrorAlert(errorRes);
				this.isLoading = false;
			}
		);
		this.authForm.reset();
	}

	onHandleError() {
		this.error = null;
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
