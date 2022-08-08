import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';

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
    map((recipes) => {
      return new recipeActions.SetRecipes(recipes);
    })
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(recipeActions.STORE_RECIPES), // gives actionData
    withLatestFrom(this.store.select('recipe')), // gives recipeState
    // receives one data array at the end, but used array destructuring [ by # of elements] here to separate the two elements in that array
    switchMap(([actionData, recipeState]) => {
      return this.http.put(
        'https://ng-course-recipe-book-abbe1-default-rtdb.firebaseio.com/recipes.json',
        recipeState.recipes
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
