import { Action } from '@ngrx/store';

import { Recipe } from '../recipe.model';

export const SET_RECIPES = '[Recipes] set recipes';
export const FETCH_RECIPES = '[Recipes] fetch recipes';
export const STORE_RECIPES = '[Recipes] store recipes';
export const ADD_RECIPE = '[Recipe] add recipe';
export const UPDATE_RECIPE = '[Recipe] update recipe';
export const DELETE_RECIPE = '[Recipe] delete recipe';

export class setRecipes implements Action {
	readonly type = SET_RECIPES;

	constructor(public payload: Recipe[]) {}
}

export class fetchRecipes implements Action {
	readonly type = FETCH_RECIPES;

	constructor() {}
}

export class storeRecipes implements Action {
	readonly type = STORE_RECIPES;

	constructor() {}
}

export class addRecipe implements Action {
	readonly type = ADD_RECIPE;

	constructor(public payload: { newRecipe: Recipe }) {}
}

export class updateRecipe implements Action {
	readonly type = UPDATE_RECIPE;

	constructor(public payload: { index: number; newRecipe: Recipe }) {}
}

export class deleteRecipe implements Action {
	readonly type = DELETE_RECIPE;

	constructor(public payload: { index: number }) {}
}

export type RecipesActions =
	| setRecipes
	| fetchRecipes
	| storeRecipes
	| addRecipe
	| updateRecipe
	| deleteRecipe;
