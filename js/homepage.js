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
const searchIng = document.querySelector('#ingredientsInput');
const searchApp = document.querySelector('#applianceInput');
const searchUst = document.querySelector('#ustensilsInput');

/* ============================= Créer la classe recette ============================= */

// creation de la classe recette
const instantiatedRecipes = recipes => recipes.map(recipe => new Recipe(recipe));
const allRecipes = instantiatedRecipes(recipes);
console.log(allRecipes);
renderRecipesHTML(allRecipes);

/* ============================= Mise à jour des listes ============================= */

function refreshAllIngredientsTagsList(recipes) {
    allIngredientsTagsSet.clear();

    for (let i = 0; i < recipes.length; i++) {
        const ingredients = recipes[i].ingredients;
        for (let { ingredient } of ingredients) {
            allIngredientsTagsSet.add(capitalizeFirstLetter(ingredient.toLowerCase()));
        };
    }
    allIngredientsTagsList = [...allIngredientsTagsSet];
}

function refreshAllAppliancesTagsList(recipes) {
    allAppliancesTagsSet.clear();

    for (let i = 0; i < recipes.length; i++) {
        const { appliance } = recipes[i];
        allAppliancesTagsSet.add(capitalizeFirstLetter(appliance.toLowerCase()));
    }
    allAppliancesTagsList = [...allAppliancesTagsSet];
}

function refreshAllUstensilsTagsList(recipes) {
    allUstensilsTagsSet.clear();

    for (let i = 0; i < recipes.length; i++) {
        const ustensils = recipes[i].ustensils;
        for (let ustencil of ustensils) {
            allUstensilsTagsSet.add(capitalizeFirstLetter(ustencil.toLowerCase()));
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
    console.time("Test #2 Array pour la première recherche");
    recipesFilteredBySearch = foundRecipes(allRecipes, search);
    console.timeEnd("Test #2 Array pour la première recherche");
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
        renderRecipesFiltered(recipesFilteredBySearch);
    }
};

function renderRecipesFiltered(recipesFiltered) {
    renderRecipesHTML(recipesFiltered);
    refreshSelectableTags(recipesFiltered);
    renderAvailableTags(allIngredientsTagsList, allAppliancesTagsList, allUstensilsTagsList);
}

function addSelectedTagToCollectionOfSelectedTags(selectedTag, selectedTagType) {
    selectedTags.set(selectedTag, selectedTagType);
}

function tagType(tagContainer) {
    console.log(tagContainer.dataset.listType)
    return tagContainer.dataset.listType;
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

        selectedTagsHTML.push(selectedTagHTML);
    })

    selectedTagsContainer.innerHTML = selectedTagsHTML.join('');
    document.querySelectorAll('.delete').forEach(btn => btn.addEventListener('click', deleteTag));
}

/* ============================= Gestion des listes avancées ============================= */

// 1/ Ouvertures
function openAdvancedList() {
    let isActive = this.classList.contains('active');
    ingContainer.classList.remove('active');
    appContainer.classList.remove('active');
    ustContainer.classList.remove('active');
    ingContainer.childNodes[1].classList.remove('active');
    appContainer.childNodes[1].classList.remove('active');
    ustContainer.childNodes[1].classList.remove('active');
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

    // selon le conteneur sur lequel on clique
    if (this.classList.contains('active')) {
        document.querySelectorAll('.search__item').forEach(item => {
            item.addEventListener('click', selectTag);
        });
        searchIng.addEventListener('keyup', searchfunction, false);
        searchApp.addEventListener('keyup', searchfunction, false);
        searchUst.addEventListener('keyup', searchfunction, false);
    } else {
        document.querySelectorAll('.search__item').forEach(item => {
            item.removeEventListener('click', selectTag);
        });
        searchIng.removeEventListener('keyup', searchfunction, false);
        searchApp.removeEventListener('keyup', searchfunction, false);
        searchUst.removeEventListener('keyup', searchfunction, false);
    }
}

ingContainer.addEventListener('click', openAdvancedList);
appContainer.addEventListener('click', openAdvancedList);
ustContainer.addEventListener('click', openAdvancedList);


// 2/ Recherches
function searchfunction(e) {
    let searchbarValue = e.target.value.toLowerCase();
    // console.log(list);
    let items
    if (e.target.id === 'ingredientsInput') {
        items = allIngredientsTagsListCont.childNodes;
    }
    if (e.target.id === 'applianceInput') {
        items = allAppliancesTagsListCont.childNodes;
    }
    if (e.target.id === 'ustensilsInput') {
        items = allUstensilsTagsListCont.childNodes;
    }
    items.forEach(item => {
        let itemList = item.innerText.toLowerCase();
        if (itemList.includes(searchbarValue)) {
            item.classList.remove('search__item--disable');
        } else {
            item.classList.add('search__item--disable');
        }
    })
    // for (let item of items) {
    //     let itemList = item.innerText.toLowerCase()
    //     if (itemList.includes(searchbarValue)) {
    //         item.classList.remove('search__item--disable')
    //     } else {
    //         item.classList.add('search__item--disable')
    //     }
    // }
}

