import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';

import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
	selector: 'app-shopping-edit',
	templateUrl: './shopping-edit.component.html',
	styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
	@ViewChild('f')
	shoppingListForm: NgForm;
	subscription: Subscription;
	editMode: boolean = false;
	editedItemIndex: number;
	editedItem: Ingredient;

	constructor(private store: Store<fromShoppingList.appStoreType>) {}

	ngOnInit() {
		this.subscription = this.store.select('shoppingList').subscribe(stateData => {
			if (stateData.editedIngredientIndex > -1) {
				this.editMode = true;
				this.editedItem = stateData.editedIngredient;
				this.shoppingListForm.setValue({
					name: this.editedItem.name,
					amount: this.editedItem.amount
				});
			} else {
				this.editMode = false;
			}
		});
	}

	ngOnDestroy() {
		this.store.dispatch(new ShoppingListActions.StopEdit());
		this.subscription.unsubscribe();
	}

	onSubmit() {
		const { name, amount } = this.shoppingListForm.value;
		const newIngredient: Ingredient = new Ingredient(name, amount);

		if (this.editMode) {
			this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
		} else {
			this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
		}
		this.onClear();
	}

	onClear() {
		this.shoppingListForm.reset();
		this.editMode = false;
		this.store.dispatch(new ShoppingListActions.StopEdit());
	}

	onDelete() {
		this.store.dispatch(new ShoppingListActions.DeleteIngredient());
		this.onClear();
	}
}
