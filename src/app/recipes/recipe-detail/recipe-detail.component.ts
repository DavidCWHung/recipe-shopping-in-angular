import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit{
  recipeLoaded: Recipe;
  id: number;

  constructor(private recipeService: RecipeService, 
              private route: ActivatedRoute,
              private router: Router) { 
  }

  ngOnInit(): void {
    // this.id = +this.route.snapshot.params['id'];
    // this.recipeLoaded = this.recipeService.getRecipe(this.id);

    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        
        this.recipeLoaded = this.recipeService.getRecipe(this.id);
      }
    );

  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipeLoaded.ingredients);
  }

  onEditRecipe() {
    console.log(this.route);

    this.router.navigate(['edit'], {relativeTo: this.route});
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
