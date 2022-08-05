import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { Recipe } from '../recipe.model';

import * as recipeActions from './recipe.actions';

@Injectable() // to make sure things can be injected to this class (service receiving class)
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(recipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://ng-course-recipe-book-abbe1-default-rtdb.firebaseio.com/recipes.json'
      );
    }),
    map((recipes) => {
      return recipes.map((recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map(recipes => {
      return new recipeActions.SetRecipes(recipes);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
