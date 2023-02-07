import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

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

	constructor(private shoppingListService: ShoppingListService) {}

	ngOnInit() {
		this.subscription = this.shoppingListService.startedEditing.subscribe((index: number) => {
			this.editedItemIndex = index;
			this.editMode = true;
			this.editedItem = this.shoppingListService.getIngredient(index);
			const { name, amount } = this.editedItem;
			this.shoppingListForm.setValue({
				name,
				amount
			});
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	onSubmit() {
		const { name, amount } = this.shoppingListForm.value;
		const newIngredient: Ingredient = new Ingredient(name, amount);

		if (this.editMode) {
			this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
		} else {
			this.shoppingListService.addIngredient(newIngredient);
		}
		this.onClear();
	}

	onClear() {
		this.shoppingListForm.reset();
		this.editMode = false;
	}

	onDelete() {
		this.shoppingListService.deleteIngredient(this.editedItemIndex);
		this.onClear();
	}
}
