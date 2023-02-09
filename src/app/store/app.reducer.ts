import { ActionReducerMap } from '@ngrx/store';

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export type appState = {
	shoppingList: fromShoppingList.stateType;
	auth: fromAuth.stateType;
};

export const appReducer: ActionReducerMap<appState> = {
	shoppingList: fromShoppingList.shoppingListReducer,
	auth: fromAuth.authReducer
};
