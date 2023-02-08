import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';

@Component({
	selector: 'app-shopping-list',
	templateUrl: './shopping-list.component.html',
	styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
	// ingredients: Ingredient[];
	ingredients: Observable<fromShoppingList.stateType>;

	// private subscription: Subscription;

	constructor(private store: Store<fromShoppingList.appStoreType>) {}

	ngOnInit() {
		this.ingredients = this.store.select('shoppingList');

		// this.ingredients = this.shoppingListService.getIngredients();
		// this.subscription = this.shoppingListService.ingredientsChanged.subscribe(
		// 	(ingredients: Ingredient[]) => {
		// 		this.ingredients = ingredients;
		// 	}
		// );
	}

	ngOnDestroy() {
		// this.subscription.unsubscribe();
	}

	onEditItem(index: number) {
		this.store.dispatch(new ShoppingListActions.StartEdit(index));
		// this.shoppingListService.startedEditing.next(index);
	}
}
