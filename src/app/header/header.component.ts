import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	isAuthenticated = false;
	private userSub: Subscription;

	constructor(private store: Store<fromApp.appState>) {}

	ngOnInit() {
		this.userSub = this.store
			.select('auth')
			.pipe(map(authState => authState.user))
			.subscribe(user => {
				// this.isAuthenticated = !user ? false : true;
				this.isAuthenticated = !!user;
			});
	}

	ngOnDestroy() {
		this.userSub.unsubscribe();
	}

	onSaveData() {
		this.store.dispatch(new RecipesActions.storeRecipes());
	}

	onFetchData() {
		this.store.dispatch(new RecipesActions.fetchRecipes());
	}

	onLogout() {
		this.store.dispatch(new AuthActions.logout());
	}
}
