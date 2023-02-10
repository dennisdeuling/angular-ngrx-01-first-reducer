import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../../app/store/app.reducer';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
	recipes: Recipe[];
	subscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<fromApp.appState>
	) {}

	ngOnInit() {
		this.subscription = this.store
			.select('recipes')
			.pipe(map(recipesState => recipesState.recipes))
			.subscribe((recipes: Recipe[]) => {
				this.recipes = recipes;
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	onNewRecipe() {
		this.router.navigate(['new'], { relativeTo: this.route });
	}
}
