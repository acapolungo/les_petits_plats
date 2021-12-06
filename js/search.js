
/* ============================= Première recherche ============================= */

export function isMatch(recipe, search) {
    return isMatchTitle(recipe, search) || isMatchIngredient(recipe, search) || isMatchDescription(recipe, search);
}

function isMatchTitle(recipe, search) {
    // if(recipe.name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
    //     console.log(recipe)
    //     return true;
    // }
    return recipe.name.toLowerCase().includes(search.toLowerCase());
}

function isMatchIngredient(recipe, search) {
    const currentIngredient = recipe.ingredients;
    // currentIngredient.every(elt => {
    //     if(elt.ingredient.toLowerCase().includes(search.toLowerCase())) {
    //         return false;
    //     }
    // })
    let match = false;
    for (const currentElt of currentIngredient) {
        if (currentElt.ingredient.toLowerCase().includes(search.toLowerCase())) {
            match = true;
            break;
        } 
    }
    // for (let i = 0; i < currentIngredient.length; i++) {
    //     if (currentIngredient[i].ingredient.toLowerCase().includes(search.toLowerCase())) {
    //         match = true;
    //         break;
    //     }
    // }
    return match;
}

function isMatchDescription(recipe, search) {
    return recipe.description.toLowerCase().includes(search.toLowerCase());
}

export function foundRecipes(recipes, search) {
    const firstFilteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
        const currentRecipe = recipes[i];
        if (isMatch(currentRecipe, search)) {
            firstFilteredRecipes.push(currentRecipe);
        }
    }
    // changer en filter
    // recipes.forEach(recipe => {
    //     if (isMatch(recipe, search)) {
    //         firstFilteredRecipes.push(recipe);
    //     };
    // });
    return firstFilteredRecipes;
}

/* ============================= La recherche avancée ============================= */

export function refreshRecipesFilteredByTags(recipesFilteredBySearch, selectedTags) {
    // un tableau temporaire va filtrer les recherche suivant le tag selectionné
    // console.log(selectedTags)

    let refreshedRecipesFilteredByTags = recipesFilteredBySearch;

    let tagType = '';
    let tagName = '';
    for (let [name, type] of selectedTags) {
        tagType = type;
        tagName = name.toLowerCase();
        //console.log([name, type])
        const searchRecipe = [];

        if (tagType === 'ing') {
            for (let i = 0; i < refreshedRecipesFilteredByTags.length; i++) {
                const currentRecipe = refreshedRecipesFilteredByTags[i];
                const currentIngredient = currentRecipe.tagsIng;
                for (let i = 0; i < currentIngredient.length; i++) {
                    const ingredients = currentIngredient[i].toLowerCase();
                    if (ingredients.includes(tagName)) {
                        searchRecipe.push(currentRecipe);
                    }
                }
            }
        }

        if (tagType === 'app') {
            for (let i = 0; i < refreshedRecipesFilteredByTags.length; i++) {
                const currentRecipe = refreshedRecipesFilteredByTags[i];
                const currentAppliance = currentRecipe.tagsApp;
                for (let i = 0; i < currentAppliance.length; i++) {
                    const appliance = currentAppliance[i].toLowerCase();
                    if (appliance.includes(tagName)) {
                        searchRecipe.push(currentRecipe);
                    }
                }
            }
        }

        if (tagType === 'ust') {
            for (let i = 0; i < refreshedRecipesFilteredByTags.length; i++) {
                const currentRecipe = refreshedRecipesFilteredByTags[i];
                const currentUstensils = currentRecipe.tagsUst;
                for (let i = 0; i < currentUstensils.length; i++) {
                    const ustensil = currentUstensils[i].toLowerCase();
                    if (ustensil.includes(tagName)) {
                        searchRecipe.push(currentRecipe);
                    }
                }
            }
        }
        // console.log(searchRecipe)
        refreshedRecipesFilteredByTags = searchRecipe;
    }
    // selectedTags.forEach((type, selectedTag) => {
    //     if (type === 'ing') {
    //         refreshedRecipesFilteredByTags = refreshedRecipesFilteredByTags.filter(recipe => recipe.tagsIng.find(currentRecipeTag => currentRecipeTag.toLowerCase() === selectedTag.toLowerCase()));
    //     }
    //     if (type === 'app') {
    //         refreshedRecipesFilteredByTags = refreshedRecipesFilteredByTags.filter(recipe => recipe.tagsApp.find(currentRecipeTag => currentRecipeTag.toLowerCase() === selectedTag.toLowerCase()));
    //     }
    //     if (type === 'ust') {
    //         refreshedRecipesFilteredByTags = refreshedRecipesFilteredByTags.filter(recipe => recipe.tagsUst.find(currentRecipeTag => currentRecipeTag.toLowerCase() === selectedTag.toLowerCase()));
    //     }
    // })
    return refreshedRecipesFilteredByTags;
}