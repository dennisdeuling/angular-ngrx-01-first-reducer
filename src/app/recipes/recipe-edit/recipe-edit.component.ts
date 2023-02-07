import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';

@Component({
	selector: 'app-recipe-edit',
	templateUrl: './recipe-edit.component.html',
	styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
	id: number;
	editMode: boolean = false;
	recipeForm: FormGroup;

	constructor(
		private route: ActivatedRoute,
		private recipeService: RecipeService,
		private router: Router
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

	onSubmit() {
		// const { name, description, imagePath, ingredients } = this.recipeForm.value;
		// const newRecipe: Recipe = new Recipe(name, description, imagePath, ingredients);
		const newRecipe = this.recipeForm.value;
		if (this.editMode) {
			this.recipeService.updateRecipe(this.id, newRecipe);
		} else {
			this.recipeService.addRecipe(newRecipe);
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
			const recipe = this.recipeService.getRecipe(this.id);
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
		}

		this.recipeForm = new FormGroup({
			name: new FormControl(recipeName, Validators.required),
			imagePath: new FormControl(recipeImagePath, Validators.required),
			description: new FormControl(recipeDescription, Validators.required),
			ingredients: recipeIngredients
		});
	}
}
