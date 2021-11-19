/* ============================= import des données ============================= */

//import des data en JS, de la const receip
import { recipes } from './recipes.js';
import { Recipes } from './recipes_class.js';
import { titleCase } from './utils.js';

/* ============================= Données des recettes  ============================= */

const mapRecipe = new Map();
let arrayRecipes = [];
// Tag selectionné dans la recherche avancée
let selectedTag = "";
let currentSearchValue = ";"
const tagIngredients = new Set();
const tagUstensils = new Set();
const tagAppliance = new Set();
let uniqueIngredients = [];
let uniqueUstencils = [];
let uniqueAppliance = [];

/* ============================= Constantes applicatives ============================= */

const main = document.querySelector('.main__result');
const ingContainer = document.querySelector('.search__ingredients');
const appContainer = document.querySelector('.search__appliance');
const ustContainer = document.querySelector('.search__ustensils');
const ingredientsList = document.querySelector('#ingredientsList');
const applianceList = document.querySelector('#applianceList');
const ustensilsList = document.querySelector('#ustensilsList');

/* ============================= Créer la classe recettes  ============================= */

const allRecipes = createRecipes(recipes);
renderAllRecipe(allRecipes)

function createRecipes(recipes) {
    return recipes.map(recipes => new Recipes(recipes));
}

// Nettoyer les contenus
function clearResults() {
    mapRecipe.clear();
    main.innerHTML = "";
}

/* ============================= A la recherche principale  ============================= */

function getResults() {
    const searchValue = document.querySelector('.search__bar').value;
    currentSearchValue = searchValue;
    //console.log(searchValue.length)

    clearResults();
    //console.log(typeof allRecipes === 'undefined')
    if (allRecipes === undefined) { return; }

    allRecipes.forEach(recipe => {
        if (searchValue.length >= 3) {
            // Si la recherche passe les 3 test de recherche
            if (recipe.isMatch(searchValue) === true) {
                if (!mapRecipe.has(recipe.id)) {
                    mapRecipe.set(recipe.id, recipe);
                }
            }

            arrayRecipes = Array.from(mapRecipe, ([name, value]) => (value));

            // Recherches avancées Ingrédient / appareils / Ustenciles
            for (let i = 0; i < arrayRecipes.length; i++) {
                let listIng = arrayRecipes[i].ingredients;
                let listApp = arrayRecipes[i].appliance;
                let listUst = arrayRecipes[i].ustensils;
                tagUstensils.add(listApp)
                tagAppliance.add(listUst)
                for (let key of listIng) {
                    //let capfirstLetterIng = titleCase(key.ingredient)
                    tagIngredients.add(key.ingredient);
                }
            }

            uniqueIngredients = [...tagIngredients];
            //console.log(uniqueIngredient);
            uniqueUstencils = [...tagUstensils].flat(" ");
            //console.log(uniqueUstencils);
            uniqueAppliance = [...tagAppliance];
            //console.log(uniqueAppliance);
        }
    });
    renderRecipesHTML(searchValue, arrayRecipes, uniqueIngredients);
};

document.querySelector('.search__bar').addEventListener('keyup', getResults);

/* ============================= Render selon des recherches  ============================= */

function renderAllRecipe(allRecipes) {
    const recipeRender = allRecipes.map(recipe => recipe.templateRecipes()).join("");
    main.innerHTML = recipeRender;
};

function renderRecipesHTML(searchValue, arrayRender, arrayList) {
    if (searchValue.length <= 2) {
        renderAllRecipe(allRecipes);
    } else {
        const recipeRender = arrayRender.map(recipe => recipe.templateRecipes()).join("");
        main.innerHTML = recipeRender;

        ingContainer.style.pointerEvents = "auto";
        appContainer.style.pointerEvents = "auto";
        ustContainer.style.pointerEvents = "auto";

        const IngredientListRender = arrayList.map((ing) => {
            return `<li class="search__item">${ing}</li>`
        }).join("");
        const applianceListRender = arrayList.map((ing) => {
            return `<li class="search__item">${ing}</li>`
        }).join("");
        const ustensilsListRender = arrayList.map((ing) => {
            return `<li class="search__item">${ing}</li>`
        }).join("");
        ingredientsList.innerHTML = IngredientListRender;
        applianceList.innerHTML = applianceListRender;
        ustensilsList.innerHTML = ustensilsListRender;
    }
};

/* ============================= A la recherche secondaire Ingrédient  ============================= */

function updateListIngredient(arrayRecipes) {
    const currentList = arrayRecipes.filter(recipe => {
        return recipe.ingredients.some(ing => ing.ingredient === selectedTag);
    });
    const filteredListHTML = currentList.map(recipe => recipe.templateRecipes()).join("");
    main.innerHTML = filteredListHTML;
}

/* ============================= Recherche par tags Ingédients============================= */

function getTags(e) {
    e.stopPropagation();
    ingContainer.classList.remove('search__open');
    document.querySelector('.search__filter--ingredients').classList.remove('search__openfilter');

    let targetTag = e.target;
    let selectedDomCont = document.querySelector('.search__tagged');

    if (!selectedDomCont) {
        selectedTag = targetTag.innerText;
        const markTag = `<span class="search__tagged search__tagged--ingredients">${selectedTag}<button class="delete">x</button></span>`;
        document.querySelector('.search__tags').innerHTML += markTag;
        document.querySelector('.delete').addEventListener('click', deleteTag);
        // Mise a jour du Tag ingrédient + render
        updateListIngredient(arrayRecipes);
    }
};

function deleteTag() {
    // Fermer la liste
    this.classList.remove('search__open');
    document.querySelector('.search__filter--ingredients').classList.remove('search__openfilter');
    document.querySelector('.search__tags').innerHTML = "";
    // Rendu Toute les recettes
    renderAllRecipe(allRecipes);
    // Vider les tags et relancer le rendu
    renderRecipesHTML(currentSearchValue, arrayRecipes, uniqueIngredients);
};

/* ============================= Recherche avancée ============================= */

function openAdvancedList() {
    const listContainer = document.querySelectorAll('.search__list');
    //console.log(listIngredients);
    if (listContainer.length > 0) {
        console.log(this);
        if(this === document.querySelector('.search__ingredients')) {
            this.classList.toggle('search__open');
            document.querySelector('.search__filter--ingredients').classList.toggle('search__openfilter');
        }
        document.querySelector('#ingredientsInput').value = '';
        document.querySelector('#ingredientsInput').focus();
        if (this.classList.contains('search__open')) {
            document.querySelectorAll('.search__item').forEach(item => {
                item.addEventListener('click', getTags);
            });
        } else {
            document.querySelectorAll('.search__item').forEach(item => {
                item.removeEventListener('click', getTags);
            });
        }
    }
}

ingContainer.addEventListener('click', openAdvancedList);
appContainer.addEventListener('click', openAdvancedList);
ustContainer.addEventListener('click', openAdvancedList);

/* ============================= Afficher les recettes selon ce qu'on tape ============================= */

// sélectionner l'élément transmis
// function selectElement(selector){
//     return document.querySelector(selector);
// }

// nettoyer le contenu dans la div de recherche
// function clearResults() {
//     document.querySelector('.search__result').innerHTML = "";
// }

// function getResults() {
//     const searchValue = document.querySelector('.search__bar').value;
//     console.log(searchValue.length);

//     clearResults();

//     allRecipes.forEach(elt => {
//         if (searchValue.length >= 3
//             && elt.name.toLocaleLowerCase().includes(searchValue.toLowerCase())) {
//             document.querySelector('.search__result').innerHTML +=
//             `<div class="search-results-items">
//                 <span class="search-item">${elt.name}</span>
//                 <span class="search-item">${elt.id}</span>
//             </div>`;
//         }
//     });

//     // for(let i = 0; i < allRecipes.length; i++) {
//     //     // tourner les textes en lowercase
//     //     if(searchValue.length >= 3 && allRecipes[i].name.toLocaleLowerCase().includes(searchValue.toLowerCase())
//     //     ){
//     //         document.querySelector('.search__result').innerHTML +=
//     //         `<div class="search-results-items">
//     //             <span class="search-item">${allRecipes[i].name}</span>
//     //             <span class="search-item">${allRecipes[i].id}</span>
//     //         </div>`;
//     //         // <span class="search-item">${recipes[i].description}</span>
//     //     }
//     // }
// }
