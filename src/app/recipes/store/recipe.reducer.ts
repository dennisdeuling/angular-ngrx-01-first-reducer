import { Recipe } from '../recipe.model';

import * as RecipesActions from './recipe.actions';

export type stateType = {
	recipes: Recipe[];
};

const initialState: stateType = {
	recipes: []
};

export function recipeReducer(
	state: stateType = initialState,
	action: RecipesActions.RecipesActions
) {
	switch (action.type) {
		case RecipesActions.SET_RECIPES:
			return {
				...state,
				recipes: [...action.payload]
			};
		case RecipesActions.ADD_RECIPE:
			return {
				...state,
				recipes: [...state.recipes, action.payload.newRecipe]
			};
		case RecipesActions.UPDATE_RECIPE:
			const { index, newRecipe } = action.payload;

			const updatedRecipe = { ...state.recipes[index], ...newRecipe };
			const updatedRecipes = [...state.recipes];
			updatedRecipes[index] = updatedRecipe;

			return {
				...state,
				recipes: updatedRecipes
			};
		case RecipesActions.DELETE_RECIPE:
			const newRecipes = state.recipes.slice(action.payload.index, 1);
			return {
				...state,
				recipes: newRecipes
			};
		default:
			return state;
	}
}
