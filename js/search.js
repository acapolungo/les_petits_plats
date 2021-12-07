
/* ============================= Première recherche ============================= */

export function isMatch(recipe, search) {
    return isMatchTitle(recipe, search) || isMatchIngredient(recipe, search) || isMatchDescription(recipe, search);
}

function isMatchTitle(recipe, search) {
    return recipe.name.toLowerCase().includes(search.toLowerCase());
}

function isMatchIngredient(recipe, search) {
    const currentIngredient = recipe.ingredients;
    currentIngredient.every(elt => {
        if(elt.ingredient.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }
    })
}

function isMatchDescription(recipe, search) {
    return recipe.description.toLowerCase().includes(search.toLowerCase());
}

export function foundRecipes(recipes, search) {
    let firstFilteredRecipes = [];
    // En filter
    firstFilteredRecipes = recipes.filter(recipe => (isMatch(recipe, search)));
    return firstFilteredRecipes;
    // En ForEach
    // recipes.forEach(recipe => {
    //     if (isMatch(recipe, search)) {
    //         firstFilteredRecipes.push(recipe);
    //     }
    // });
    // return firstFilteredRecipes;
}

/* ============================= La recherche avancée ============================= */

export function refreshRecipesFilteredByTags(recipesFilteredBySearch, selectedTags) {
    // un tableau temporaire va filtrer les recherche suivant le tag selectionné
    let refreshedRecipesFilteredByTags = recipesFilteredBySearch;

    selectedTags.forEach((type, selectedTag) => {
        if (type === 'ing') {
            refreshedRecipesFilteredByTags = refreshedRecipesFilteredByTags.filter(recipe => recipe.tagsIng.find(currentRecipeTag => currentRecipeTag.toLowerCase() === selectedTag.toLowerCase()));
        }
        if (type === 'app') {
            refreshedRecipesFilteredByTags = refreshedRecipesFilteredByTags.filter(recipe => recipe.tagsApp.find(currentRecipeTag => currentRecipeTag.toLowerCase() === selectedTag.toLowerCase()));
        }
        if (type === 'ust') {
            refreshedRecipesFilteredByTags = refreshedRecipesFilteredByTags.filter(recipe => recipe.tagsUst.find(currentRecipeTag => currentRecipeTag.toLowerCase() === selectedTag.toLowerCase()));
        }
    });
    return refreshedRecipesFilteredByTags;
}