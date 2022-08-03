import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null, 
    editedIngredientIndex: -1
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) { // refactored the code to be more specific such that action.payload property can be detected by auto-completion
    switch (action.type) {       
        case ShoppingListActions.ADD_INGREDIENT: 
            // state.ingredients.push() // bad practice and forbidden, existing or previous state should be immutable, never touch it
            return {
                ...state, // rule of thumb: always copy the old state then overwrite what you want to change
                ingredients: [...state.ingredients, action.payload] 
            };

        case ShoppingListActions.ADD_INGREDIENTS: 
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload] // use the spread operator to pull the elements out of the Ingredient[] array for payload
            }
        
        case ShoppingListActions.UPDATE_INGREDIENT:
            // immutable logic: should not change the initial or previous state so need to create copies and do the edits on copies (a good practice to prevent potential bugs)
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            };

            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1, 
                editedIngredient: null
            }; // receive the update action and react to return an object that reflects the new state

        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state, 
                // filter is an array method that will always return a copy of an updated array
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== state.editedIngredientIndex; // filter criteria, kept true and exclude false for the new array
                }),
                editedIngredientIndex: -1, 
                editedIngredient: null
            };

        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload] } // to create a new (Ingredient) object by using {} and spread operator due to the reference type nature of objects and arrays
            };

        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };

        default: 
            return state; // return the initial state
    }
}