import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';

@Component({
	selector: 'app-recipe-edit',
	templateUrl: './recipe-edit.component.html',
	styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
	id: number;
	editMode: boolean = false;
	recipeForm: FormGroup;
	private storeSub: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private store: Store<fromApp.appState>
	) {}

	get controls() {
		return (<FormArray>this.recipeForm.get('ingredients')).controls;
	}

	ngOnInit() {
		this.route.params.subscribe((params: Params) => {
			this.id = parseInt(params['id']);
			this.editMode = params['id'] != null;
			this.initForm();
		});
	}

	ngOnDestroy() {
		if (this.storeSub) {
			this.storeSub.unsubscribe();
		}
	}

	onSubmit() {
		if (this.editMode) {
			this.store.dispatch(
				new RecipesActions.updateRecipe({ index: this.id, newRecipe: this.recipeForm.value })
			);
		} else {
			this.store.dispatch(new RecipesActions.addRecipe({ newRecipe: this.recipeForm.value }));
		}
		this.onCancel();
	}

	onAddIngredient() {
		(<FormArray>this.recipeForm.get('ingredients')).push(
			new FormGroup({
				name: new FormControl(null, Validators.required),
				amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
			})
		);
	}

	onCancel() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	onDeleteIngredient(index: number) {
		(<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
	}

	private initForm() {
		let recipeName: string = '';
		let recipeImagePath: string = '';
		let recipeDescription: string = '';
		let recipeIngredients: FormArray = new FormArray([]);

		if (this.editMode) {
			this.storeSub = this.store
				.select('recipes')
				.pipe(
					map(recipesState => {
						return recipesState.recipes.find((recipe, index) => index === this.id);
					})
				)
				.subscribe(recipe => {
					recipeName = recipe.name;
					recipeDescription = recipe.description;
					recipeImagePath = recipe.imagePath;

					if (recipe['ingredients']) {
						// TODO: replace with map
						for (let ingredient of recipe.ingredients) {
							recipeIngredients.push(
								new FormGroup({
									name: new FormControl(ingredient.name, Validators.required),
									amount: new FormControl(ingredient.amount, [
										Validators.required,
										Validators.pattern(/^[1-9]+[0-9]*$/)
									])
								})
							);
						}
					}
				});
		}

		this.recipeForm = new FormGroup({
			name: new FormControl(recipeName, Validators.required),
			imagePath: new FormControl(recipeImagePath, Validators.required),
			description: new FormControl(recipeDescription, Validators.required),
			ingredients: recipeIngredients
		});
	}
}
