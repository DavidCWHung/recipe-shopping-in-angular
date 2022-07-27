import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe('A Test Recipe 1', 
    //                'This is simply a test', 
    //                'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
    //                [
    //                 new Ingredient('Bun', 2),
    //                 new Ingredient('Egg', 2)
    //                ]),
    //     new Recipe('A Test Recipe 2', 
    //                'This is simply a test', 
    //                'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
    //                [
    //                 new Ingredient('Beef', 1.5),
    //                 new Ingredient('Bread', 1)
    //                ])
    // ];    

    private recipes: Recipe[] = []; 

    constructor(private shoppingListService: ShoppingListService,
                private router: Router) {}

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredientsFromRecipe(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }
}