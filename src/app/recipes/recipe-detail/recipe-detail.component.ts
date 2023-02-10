import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
	selector: 'app-recipe-detail',
	templateUrl: './recipe-detail.component.html',
	styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
	recipe: Recipe;
	id: number;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<fromApp.appState>
	) {}

	ngOnInit() {
		this.route.params
			.pipe(
				map(params => parseInt(params['id'])),
				switchMap(id => {
					this.id = id;
					return this.store.select('recipes');
				}),
				map(recipesState => recipesState.recipes.find((recipe, index) => index === this.id))
			)
			.subscribe(recipe => {
				this.recipe = recipe;
			});

		// 	this.store
		// 		.select('recipes')
		// 		.pipe(map(recipesState => recipesState.recipes.find((recipe, index) => index === this.id)))
		// 		.subscribe(recipe => {
		// 			this.recipe = recipe;
		// 		});
		// });
	}

	onAddToShoppingList() {
		this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
	}

	onEditRecipe() {
		this.router.navigate(['edit'], { relativeTo: this.route });
	}

	onDeleteRecipe() {
		this.store.dispatch(new RecipesActions.deleteRecipe({ index: this.id }));
		this.router.navigate(['/recipes']);
	}
}
