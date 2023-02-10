import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
	private databaseUrl =
		'https://angular-recipe-book-a912b-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
	@Effect({ dispatch: false })
	storeRecipes = this.actions$.pipe(
		ofType(RecipesActions.STORE_RECIPES),
		withLatestFrom(this.store.select('recipes')),
		switchMap(([actionData, recipesState]) => {
			return this.http.put(this.databaseUrl, recipesState.recipes);
		})
	);
	@Effect()
	fetchRecipes = this.actions$.pipe(
		ofType(RecipesActions.FETCH_RECIPES),
		switchMap(() => {
			return this.http.get<Recipe[]>(this.databaseUrl);
		}),
		map(recipes => {
			return recipes.map(recipe => ({
				...recipe,
				ingredients: recipe.ingredients ? recipe.ingredients : []
			}));
		}),
		map(recipes => new RecipesActions.setRecipes(recipes))
	);

	constructor(
		private actions$: Actions,
		private http: HttpClient,
		private store: Store<fromApp.appState>
	) {}
}
