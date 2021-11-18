/* ============================= import des données ============================= */

//import des data en JS, de la const receip
import { recipes } from './recipes.js';
import { Recipes } from './recipes_class.js';

/* ============================= Données des recettes  ============================= */

let arrayRecipes = [];
let uniqueIngredients = [];
let uniqueUstencils = [];
let uniqueAppliance = [];
let selectedTag = "";
const mapRecipe = new Map();
const tagIngredients = new Set();
const tagUstensils = new Set();
const tagAppliance = new Set();

/* ============================= Constantes applicatives ============================= */

const main = document.querySelector('.main__result');
const ingredientsList = document.querySelector('#ingredientsList');
const applianceList = document.querySelector('#applianceList');
const ustensilsList = document.querySelector('#ustensilsList');

/* ============================= Créer la classe recettes  ============================= */

const allRecipes = createRecipes(recipes);
renderAllRecipe(recipes)

function createRecipes(recipes) {
    return recipes.map(recipes => new Recipes(recipes));
}

// Nettoyer les contenus
function clearResults() {
    mapRecipe.clear();
    main.innerHTML = "";
    ingredientsList.innerHTML="";
    applianceList.innerHTML="";
    ustensilsList.innerHTML="";
}

/* ============================= A la recherche principale  ============================= */

function getResults() {
    const searchValue = document.querySelector('.search__bar').value;

    clearResults();
    //console.log(typeof allRecipes === 'undefined')
    if (allRecipes === undefined) {return;}

    allRecipes.forEach(recipe => {
        console.log(searchValue.length)

        if (searchValue.length >= 3) {
            // Si la recherche passe les 3 test de recherche
            if (recipe.isMatch(searchValue) === true) {
                if (!mapRecipe.has(recipe.id)) {
                    mapRecipe.set(recipe.id, recipe);
                }
            }
            arrayRecipes = Array.from(mapRecipe, ([name, value]) => (value));

            // =============== Ingrédients, ustenciles et appareils ===============
            for (let i = 0; i < arrayRecipes.length; i++) {
                let listIng = arrayRecipes[i].ingredients;
                let listApp = arrayRecipes[i].appliance;
                let listUst = arrayRecipes[i].ustensils;
                tagUstensils.add(listApp)
                tagAppliance.add(listUst)
                for (let key of listIng) {
                    tagIngredients.add(key.ingredient);
                }
            }

            uniqueIngredients = [...tagIngredients];
            uniqueUstencils = [...tagUstensils].flat(" ");
            uniqueAppliance = [...tagAppliance];
            //console.log(uniqueIngredient);
            //console.log(uniqueUstencils);
            //console.log(uniqueAppliance);
        }
    });
    
    if (searchValue.length <= 2) {
        renderAllRecipe();
    } else {
        renderRecipesHTML(arrayRecipes, uniqueIngredients);
    }
};

document.querySelector('.search__bar').addEventListener('keyup', getResults);

function renderAllRecipe() {
    const recipeRender = allRecipes.map(recipe => recipe.templateRecipes()).join("");
    main.innerHTML = recipeRender;
};

function renderRecipesHTML(arrayRender, arrayList) {
        const recipeRender = arrayRender.map(recipe => recipe.templateRecipes()).join("");
        const IngredientListRender = arrayList.map((ing) => {
            return `<li class="search__item">${ing}</li>`
        }).join("");
        //console.log(IngredientListRender)
    
        main.innerHTML = recipeRender;
        ingredientsList.innerHTML = IngredientListRender;
};

/* ============================= A la recherche secondaire Ingrédient  ============================= */

function getRecipeByIng(arrayRecipes) {
    const filteredRecipeByIng = arrayRecipes.filter(recipe => {
        return recipe.ingredients.some(ing => ing.ingredient === selected);
    });
    console.log(filteredRecipeByIng);

    // =============== Nouveau render ===============
    const filteredRender = filteredRecipeByIng.map(recipe => recipe.templateRecipes()).join("");
    main.innerHTML = filteredRender;
}

/* ============================= Recherche par tags Ingédients============================= */

function getTags(e) {
    e.stopPropagation();
    document.querySelector('.search__ingredients').classList.remove('search__open');
    document.querySelector('.search__filter--ingredients').classList.remove('search__openfilter');

    let targetTag = e.target;
    let selectedDomCont = document.querySelector('.search__tagged');

    if (!selectedDomCont) {
        selectedTag = targetTag.innerText;
        const markTag = `<span class="search__tagged search__tagged--ingredients">${selectedTag}<button class="delete">x</button></span>`;
        document.querySelector('.search__tags').innerHTML += markTag;
        document.querySelector('.delete').addEventListener('click', deleteTag);
    }
    getRecipeByIng(arrayRecipes);
};

function deleteTag() {
    document.querySelector('.search__ingredients').classList.remove('search__open');
    document.querySelector('.search__filter--ingredients').classList.remove('search__openfilter');
    document.querySelector('.search__tags').innerHTML = "";
};

/* ============================= Recherche avancée ============================= */

function openListIngredient() {
    const listIngredients = document.querySelectorAll('.search__list');
    console.log(listIngredients)
    if (listIngredients.length > 0) {
        document.querySelector('.search__ingredients').classList.toggle('search__open');
        document.querySelector('.search__filter--ingredients').classList.toggle('search__openfilter');
        document.querySelector('#ingredientsInput').value = '';
        document.querySelector('#ingredientsInput').focus();

        if (document.querySelector('.search__ingredients').classList.contains('search__open')) {
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

document.querySelector('.search__ingredients').addEventListener('click', openListIngredient);

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