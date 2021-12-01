/* ============================= import des données ============================= */

//import des data en JS, de la const receip
import { recipes } from './recipes.js';
import { Recipe } from './recipes_class.js';
import { capitalizeFirstLetter } from './utils.js';
import { foundRecipes, refreshRecipesFilteredByTags } from './search.js';

/* ============================= Données des recettes ============================= */

let recipesFilteredBySearch = [];
let recipesFilteredByTags = [];
// Set des listes pour recherches avancées
const allIngredientsTagsSet = new Set();
const allUstensilsTagsSet = new Set();
const allAppliancesTagsSet = new Set();
// Map de tag selectionnés
const selectedTags = new Map();
// Tableaux des listes
let allIngredientsTagsList = [];
let allAppliancesTagsList = [];
let allUstensilsTagsList = [];

/* ============================= Constantes applicatives ============================= */

const main = document.querySelector('.main__result');
const selectedTagsContainer = document.querySelector('.search__tags');
const ingContainer = document.querySelector('.search__ingredients');
const appContainer = document.querySelector('.search__appliance');
const ustContainer = document.querySelector('.search__ustensils');
const allIngredientsTagsListCont = document.querySelector('#ingredientsList');
const allAppliancesTagsListCont = document.querySelector('#applianceList');
const allUstensilsTagsListCont = document.querySelector('#ustensilsList');

/* ============================= Créer la classe recette ============================= */

// creation de la classe recette
const instantiatedRecipes = recipes => recipes.map(recipe => new Recipe(recipe));
const allRecipes = instantiatedRecipes(recipes);
console.log(allRecipes);
renderRecipesHTML(allRecipes);

/* ============================= Première recherche ============================= */

// function isMatch(recipe, search) {
//     return isMatchTitle(recipe, search) || isMatchIngredient(recipe, search) || isMatchDescription(recipe, search);
// }

// function isMatchTitle(recipe, search) {
//     return recipe.name.toLowerCase().includes(search.toLowerCase());
// }

// function isMatchIngredient(recipe, search) {
//     const currentIngredient = recipe.ingredients;
//     let match = false;
//     for (let i = 0; i < currentIngredient.length; i++) {
//         if (currentIngredient[i].ingredient.toLowerCase().includes(search.toLowerCase())) {
//             match = true;
//             break;
//         }
//     }
//     return match;
// }

// function isMatchDescription(recipe, search) {
//     return recipe.description.toLowerCase().includes(search.toLowerCase());
// }

// function foundRecipes(recipes, search) {
//     const firstFilteredRecipes = [];

//     recipes.forEach(recipe => {
//         if (isMatch(recipe, search)) {
//             firstFilteredRecipes.push(recipe);
//         };
//     });

//     return firstFilteredRecipes;
// };

/* ============================= Mise à jour des listes ============================= */

function refreshAllIngredientsTagsList(recipes) {
    allIngredientsTagsSet.clear();

    for (let i = 0; i < recipes.length; i++) {
        const ingredients = recipes[i].ingredients;
        for (let { ingredient } of ingredients) {
            allIngredientsTagsSet.add(capitalizeFirstLetter(ingredient));
        };
    }
    allIngredientsTagsList = [...allIngredientsTagsSet];
}

function refreshAllAppliancesTagsList(recipes) {
    allAppliancesTagsSet.clear();

    for (let i = 0; i < recipes.length; i++) {
        const { appliance } = recipes[i];
        allAppliancesTagsSet.add(capitalizeFirstLetter(appliance));
    }
    allAppliancesTagsList = [...allAppliancesTagsSet];
}

function refreshAllUstensilsTagsList(recipes) {
    allUstensilsTagsSet.clear();

    for (let i = 0; i < recipes.length; i++) {
        const ustensils = recipes[i].ustensils;
        for (let ustencil of ustensils) {
            allUstensilsTagsSet.add(capitalizeFirstLetter(ustencil));
        };
    }
    //console.log(allUstensilsTagsList)
    allUstensilsTagsList = [...allUstensilsTagsSet];
}

function refreshSelectableTags(recipes) {
    refreshAllIngredientsTagsList(recipes);
    refreshAllAppliancesTagsList(recipes);
    refreshAllUstensilsTagsList(recipes);
};

/* ============================= Recherche par value (principale) ============================= */

// Nettoyer les recettes, et les listes au démarrage de la recherche
function clearResults() {
    main.innerHTML = "";
    allIngredientsTagsSet.clear();
    allAppliancesTagsSet.clear();
    allUstensilsTagsSet.clear();
    selectedTags.clear();
}

function getResults({ target: { value: search } }) {
    clearResults();

    if (isValidSearch(search)) {
        searchResult(search);
        displayValidSearchResult()
    } else {
        displayAllRecipes();
    }
}

function isValidSearch(search) {
    return search.length >= 3;
}

function searchResult(search) {
    recipesFilteredBySearch = foundRecipes(allRecipes, search);
}

function displayValidSearchResult() {
    ingContainer.classList.add("search__ingredients--disable");
    appContainer.classList.add("search__appliance--disable");
    ustContainer.classList.add("search__ustensils--disable");
    renderRecipesFiltered(recipesFilteredBySearch);
}

function displayAllRecipes() {
    ingContainer.classList.remove("search__ingredients--disable");
    appContainer.classList.remove("search__appliance--disable");
    ustContainer.classList.remove("search__ustensils--disable");
    renderRecipesHTML(allRecipes);
}

document.querySelector('.search__bar').addEventListener('keyup', getResults);

function filteredResult() {
    recipesFilteredByTags = refreshRecipesFilteredByTags(recipesFilteredBySearch, selectedTags);
}

/*
function updateRecipe(recipes) {
    // tableau temporaire pour effecter les recherches sur les 3 éléments
    let filterRecipe = recipes;

    selectedTags.forEach((value, key) => {
        if (value === 'ing') {
            filterRecipe = filterRecipe.filter(recipe => {
                // const intersection = selectedTagsArray.filter(tag => recipe.tagsIng.find(word => word.toLowerCase().includes(tag.toLowerCase())));
                // return intersection.length > 0;
                return recipe.tagsIng.find(word => word.toLowerCase() === key.toLowerCase());
            });
        }
        if (value === 'app') {
            filterRecipe = filterRecipe.filter(recipe => {
                // const intersection = selectedTagsArray.filter(tag => recipe.tagsApp.find(word => word.toLowerCase().includes(tag.toLowerCase())));
                // return intersection.length > 0;
                return recipe.tagsApp.find(word => word.toLowerCase() === key.toLowerCase());
            });
        }
        if (value === 'ust') {
            filterRecipe = filterRecipe.filter(recipe => {
                // const intersection = selectedTagsArray.filter(tag => recipe.tagsUst.find(word => word.toLowerCase().includes(tag.toLowerCase())));
                // return intersection.length > 0;
                return recipe.tagsUst.find(word => word.toLowerCase() === key.toLowerCase());
            });
        }
    });
    // filter element by all tags
    // const filteredRecipe = recipes.filter(recipe => {
    //     const intersection = selectedTagsArray.filter(tag => recipe.tags.find(word => word.toLowerCase().includes(tag.toLowerCase())))
    //     return intersection.length > 0;
    // });
    return filterRecipe;
}
*/

function selectTag({ target }) {
    const { innerText: selectedTag, parentNode: tagContainer } = target; // {innerText: 'Poulet', parentNode: {id: '#ingredientsList'}}

    // Nous donne le type du tag selectionné
    // 1 Selection du tag
    //   a. [ajout du tags aux tags selectionnés]
    //   b. rafraichissement les tags selectionnés (selected)
    // 2 Filtrage des recettes selon les tags sélectionnés
    //   a. filtrage des recettes
    //   b. rafraichissement des tags selectionnable (available)
    //   c. rafraichissement des recettes affichées
    addSelectedTagToCollectionOfSelectedTags(selectedTag, tagType(tagContainer));
    renderSelectedTags(recipesFilteredByTags, tagContainer, selectedTag);
    refreshRecipesFilteredByTags(recipesFilteredBySearch, selectedTags);
    filteredResult();
    renderRecipesFiltered(recipesFilteredByTags);
};

function deleteTag(event) {
    const deletedTagText = event.target.parentNode.childNodes[0].textContent;
    selectedTags.delete(deletedTagText);
    renderSelectedTags();

    if (selectedTags.size > 0) {
        refreshRecipesFilteredByTags(recipesFilteredBySearch, selectedTags);
        filteredResult();
        renderRecipesFiltered(recipesFilteredByTags);
    } else {
        renderRecipesFiltered(recipesFilteredBySearch)
    }
};

function renderRecipesFiltered(recipesFiltered) {
    renderRecipesHTML(recipesFiltered);
    refreshSelectableTags(recipesFiltered)
    renderAvailableTags(allIngredientsTagsList, allAppliancesTagsList, allUstensilsTagsList);
}

// function renderRecipesFilteredBySearch() {
//     renderRecipesHTML(recipesFilteredBySearch);
//     refreshSelectableTags(recipesFilteredBySearch)
//     renderAvailableTags(allIngredientsTagsList, allAppliancesTagsList, allUstensilsTagsList);
// }

// function renderRecipesFilteredByTags() {
//     renderRecipesHTML(recipesFilteredByTags);
//     refreshSelectableTags(recipesFilteredByTags)
//     renderAvailableTags(allIngredientsTagsList, allAppliancesTagsList, allUstensilsTagsList);
// }

function addSelectedTagToCollectionOfSelectedTags(selectedTag, selectedTagType) {
    selectedTags.set(selectedTag, selectedTagType);
}

function tagType(tagContainer) {
    switch (tagContainer.id) {
        case "ingredientsList":
            return 'ing';
        case "applianceList":
            return 'app';
        case "ustensilsList":
            return 'ust';
        // no default really required here
    }
}

/* ============================= Rendus des recettes et des listes ============================= */

function renderRecipesHTML(recipes) {
    if (recipes.length > 0) {
        const recipeRender = recipes.map(recipe => recipe.templateRecipes()).join("");
        main.innerHTML = recipeRender;
    } else {
        main.innerHTML = `<span class="main__empty">aucun résultat ne correspond à votre recherche</span>`;
    }
}

function renderAvailableTags(allIngredientsTagsList, allAppliancesTagsList, allUstensilsTagsList) {
    const allIngredientsTagsHTML = allIngredientsTagsList.map((ing) => {
        return `<li class="search__item">${ing}</li>`
    }).join("");
    const allAppliancesTagsHTML = allAppliancesTagsList.map((app) => {
        return `<li class="search__item">${app}</li>`
    }).join("");
    const allUstensilsTagsHTML = allUstensilsTagsList.map((ust) => {
        return `<li class="search__item">${ust}</li>`
    }).join("");

    allIngredientsTagsListCont.innerHTML = allIngredientsTagsHTML;
    allAppliancesTagsListCont.innerHTML = allAppliancesTagsHTML;
    allUstensilsTagsListCont.innerHTML = allUstensilsTagsHTML;
}

/* ============================= Rendus des tags selectionnés ============================= */

function renderSelectedTags() {
    const selectedTagsHTML = [];

    selectedTags.forEach((type, tag) => {
        const selectedTagHTML = `<span class="search__tagged search__tagged--${type}">${tag}<button class="delete">x</button></span>`;

        selectedTagsHTML.push(selectedTagHTML)
    })

    selectedTagsContainer.innerHTML = selectedTagsHTML.join('')
    document.querySelectorAll('.delete').forEach(btn => btn.addEventListener('click', deleteTag));
}

/* ============================= Gestion de l'ouverture des listes après la recherche ============================= */

function openAdvancedList() {
    let isActive = this.classList.contains('active');
    ingContainer.classList.remove('active');
    appContainer.classList.remove('active');
    ustContainer.classList.remove('active');
    ingContainer.childNodes[1].classList.remove('active')
    appContainer.childNodes[1].classList.remove('active')
    ustContainer.childNodes[1].classList.remove('active')
    if (!isActive) {
        this.classList.add('active');
        this.childNodes[1].classList.add('active');
        if (this === ingContainer) {
            document.querySelector('#ingredientsInput').value = '';
            document.querySelector('#ingredientsInput').focus();
        }
        if (this === appContainer) {
            document.querySelector('#applianceInput').value = '';
            document.querySelector('#applianceInput').focus();
        }
        if (this === ustContainer) {
            document.querySelector('#ustensilsInput').value = '';
            document.querySelector('#ustensilsInput').focus();
        }
    }

    // if (!document.querySelector('.active')) {
    //     if (this === ingContainer) {
    //         this.classList.toggle('active');
    //         this.childNodes[1].classList.toggle('active');
    //         document.querySelector('#ingredientsInput').value = '';
    //         document.querySelector('#ingredientsInput').focus();
    //     }
    //     if (this === appContainer) {
    //         this.classList.toggle('active');
    //         this.childNodes[1].classList.toggle('active');
    //         document.querySelector('#applianceInput').value = '';
    //         document.querySelector('#applianceInput').focus();
    //     }
    //     if (this === ustContainer) {
    //         this.classList.toggle('active');
    //         this.childNodes[1].classList.toggle('active');
    //         document.querySelector('#ustensilsInput').value = '';
    //         document.querySelector('#ustensilsInput').focus();
    //     }
    // } else {
    //     this.classList.remove('active');
    //     this.childNodes[1].classList.remove('active')
    // }

    // selon le conteneur sur lequel on clique
    if (this.classList.contains('active')) {
        document.querySelectorAll('.search__item').forEach(item => {
            item.addEventListener('click', selectTag);
        });
    } else {
        document.querySelectorAll('.search__item').forEach(item => {
            item.removeEventListener('click', selectTag);
        });
    }
}

ingContainer.addEventListener('click', openAdvancedList);
appContainer.addEventListener('click', openAdvancedList);
ustContainer.addEventListener('click', openAdvancedList);

// const pets = ['cat toto', 'dog', 'bat'];
// console.log(pets.indexOf('cat'));
// console.log(pets.find(elt => elt.includes('toto')));