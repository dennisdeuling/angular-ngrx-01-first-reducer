import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
	recipesChanged = new Subject<Recipe[]>();

	// private recipes: Recipe[] = [
	// 	new Recipe(
	// 		'Tasty Schnitzel',
	// 		'A super tasty Schnitzel - just awesome!',
	// 		'https://www.toprezepte.eu/recipe/6/Wiener-Schnitzel-60993d7a49246.jpg',
	// 		[
	// 			new Ingredient('Meat', 1),
	// 			new Ingredient('Panko', 1),
	// 			new Ingredient('Eggs', 2),
	// 			new Ingredient('Flour', 1),
	// 			new Ingredient('French Fries', 20)
	// 		]
	// 	),
	// 	new Recipe(
	// 		'Big Fat Burger',
	// 		'What else you need to  say?',
	// 		'https://image.brigitte.de/12444002/t/dg/v3/w960/r1/-/burger-vom-grill.jpg',
	// 		[
	// 			new Ingredient('Buns', 2),
	// 			new Ingredient('Patty', 2),
	// 			new Ingredient('Salad', 2),
	// 			new Ingredient('Tomato', 1),
	// 			new Ingredient('Onion', 1),
	// 			new Ingredient('Jalapeños', 4),
	// 			new Ingredient('Mayo', 1)
	// 		]
	// 	)
	// ];

	private recipes: Recipe[] = [];

	constructor(private shoppingListService: ShoppingListService) {}

	getRecipes() {
		return this.recipes.slice();
	}

	setRecipes(recipes: Recipe[]) {
		this.recipes = recipes;
		this.recipesChanged.next(this.recipes.slice());
	}

	getRecipe(index: number) {
		return this.recipes[index];
	}

	addIngredientsToShoppingList(ingredients: Ingredient[]) {
		this.shoppingListService.addIngredients(ingredients);
	}

	addRecipe(recipe: Recipe) {
		this.recipes.push(recipe);
		this.recipesChanged.next(this.recipes.slice());
	}

	updateRecipe(index: number, newRecipe: Recipe) {
		this.recipes[index] = newRecipe;
		this.recipesChanged.next(this.recipes.slice());
	}

	deleteRecipe(index: number) {
		this.recipes.splice(index, 1);
		this.recipesChanged.next(this.recipes.slice());
	}
}
