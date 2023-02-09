import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
	selector: 'app-shopping-list',
	templateUrl: './shopping-list.component.html',
	styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
	ingredients: Observable<{ ingredients: Ingredient[] }>;

	constructor(private store: Store<fromApp.appState>) {}

	ngOnInit() {
		this.ingredients = this.store.select('shoppingList');
	}

	ngOnDestroy() {}

	onEditItem(index: number) {
		this.store.dispatch(new ShoppingListActions.StartEdit(index));
	}
}
