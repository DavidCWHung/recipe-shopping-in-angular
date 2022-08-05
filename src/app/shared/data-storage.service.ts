import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, tap, take, exhaustMap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient,
        private recipeService: RecipeService,
        private store: Store<fromApp.AppState>) { }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();

        // put request offered by firebase that store and overwrite all the data in the database
        // added /recipes,json
        // since not going to use the reponse in header component, can just subscribe here
        this.http.put('https://ng-course-recipe-book-abbe1-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => {
            console.log(response);
        });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>('https://ng-course-recipe-book-abbe1-default-rtdb.firebaseio.com/recipes.json').pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                });
            }),
            tap(recipes => {
                // this.recipeService.setRecipes(recipes);
                this.store.dispatch(new RecipeActions.SetRecipes(recipes));
            })
        );
    }
}
