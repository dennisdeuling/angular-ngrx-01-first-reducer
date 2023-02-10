import { ActionReducerMap } from '@ngrx/store';

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '../recipes/store/recipe.reducer';

export type appState = {
	shoppingList: fromShoppingList.stateType;
	recipes: fromRecipes.stateType;
	auth: fromAuth.stateType;
};

export const appReducer: ActionReducerMap<appState> = {
	shoppingList: fromShoppingList.shoppingListReducer,
	recipes: fromRecipes.recipeReducer,
	auth: fromAuth.authReducer
};
