import * as ShoppingListActions from './shopping-list.actions';
import { Ingredient } from '../../shared/ingredient.model';

export type appStoreType = {
	shoppingList: stateType;
};

export type stateType = {
	ingredients: Ingredient[];
	editedIngredient: Ingredient | null;
	editedIngredientIndex: number;
};

const initialState: stateType = {
	ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatos', 10)],
	editedIngredient: null,
	editedIngredientIndex: -1
};

export function ShoppingListReducer(
	state: stateType = initialState,
	action: ShoppingListActions.ShoppingListActions
) {
	switch (action.type) {
		case ShoppingListActions.ADD_INGREDIENT:
			return {
				...state,
				ingredients: [...state.ingredients, action.payload]
			};
		case ShoppingListActions.ADD_INGREDIENTS:
			return {
				...state,
				ingredients: [...state.ingredients, ...action.payload]
			};
		case ShoppingListActions.UPDATE_INGREDIENT:
			const ingredient = state.ingredients[state.editedIngredientIndex];
			const updatedIngredient = {
				...ingredient,
				...action.payload
			};

			const updatedIngredients = [...state.ingredients];
			updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

			return {
				...state,
				ingredients: updatedIngredients,
				editedIngredientIndex: -1,
				editedIngredient: null
			};
		case ShoppingListActions.DELETE_INGREDIENT:
			const ingredients = state.ingredients.filter(
				(ingredient, index) => index !== state.editedIngredientIndex
			);

			return {
				...state,
				ingredients: ingredients,
				editedIngredientIndex: -1,
				editedIngredient: null
			};
		case ShoppingListActions.START_EDIT:
			return {
				...state,
				editedIngredientIndex: action.payload,
				editedIngredient: { ...state.ingredients[action.payload] }
			};
		case ShoppingListActions.STOP_EDIT:
			return {
				...state,
				editedIngredientIndex: -1,
				editedIngredient: null
			};

		default:
			return state;
	}
}
