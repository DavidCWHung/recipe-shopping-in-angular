import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipeLoaded: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    // this.id = +this.route.snapshot.params['id'];
    // this.recipeLoaded = this.recipeService.getRecipe(this.id);

    this.route.params.pipe(
      map((params) => {
        return +params['id'];
      }),
      switchMap((id) => {
        this.id = id;
        return this.store.select('recipe');
      }),
      map((recipeState) => {
        return recipeState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })
    )
    .subscribe(recipe => {
      this.recipeLoaded = recipe;
    });
  }

  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(
    //   this.recipeLoaded.ingredients
    // );

    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipeLoaded.ingredients));
  }

  onEditRecipe() {
    console.log(this.route);

    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
