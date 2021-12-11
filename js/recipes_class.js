// ============================= CREER la classe recette et ses méthodes =============================

export class Recipe {
    constructor({ id, name, servings, ingredients, time, description, appliance, ustensils}) {
        this.id = id;
        this.name = name;
        this.servings = servings;
        this.ingredients = ingredients;
        this.time = time;
        this.description = description;
        this.appliance = appliance;
        this.ustensils = ustensils;
        this.tagsIng = [];
        this.tagsApp = [];
        this.tagsUst = [];
        this.seedTags();
    }
    // isMatch(search) {
    //     return this.isMatchTitle(search) || this.isMatchIngredient(search) || this.isMatchDescription(search);
    // }

    // isMatchTitle(search) {
    //     return this.name.toLowerCase().includes(search.toLowerCase());
    // }

    // isMatchIngredient(search) {
    //     const currentIngredient = this.ingredients;
    //     let match = false;
    //     for (let i = 0; i < currentIngredient.length; i++) {
    //         //console.log(currentIngredient[i].ingredient)
    //         if (currentIngredient[i].ingredient.toLowerCase().includes(search.toLowerCase())) {
    //             match = true;
    //             break;
    //         }
    //     }
    //     return match;
    // }

    // isMatchDescription(search) {
    //     return this.description.toLowerCase().includes(search.toLowerCase());
    // }

    seedTags() {
        const setIng = new Set;
        const setApp = new Set;
        const setUst = new Set;

        let ingredients = this.ingredients;
        for(let i = 0; i < ingredients.length; i++) {
            let recipeIngredient = ingredients[i].ingredient;
            setIng.add(recipeIngredient.toLowerCase());
        }

        let appliance = this.appliance;
        setApp.add(appliance.toLowerCase());

        let ustencils = this.ustensils;
        for(let i = 0; i < ustencils.length; i++) {
            let recipeustencils = ustencils[i];
            setUst.add(recipeustencils.toLowerCase());
        }
        this.tagsIng = [...setIng];
        this.tagsApp = [...setApp];
        this.tagsUst = [...setUst];
    }

    ingredientsHTML() {
        return this.ingredients.map(({ ingredient, quantity = "", unit = "" }) => {
            quantity = `: ${quantity}`;
            unit === "grammes"? unit = "gr" : unit = unit;
            return `<p class="recipes__ingr">${ingredient} <span>${quantity} ${unit}</span></p>`
        }).join("");
        // let concatIngredients = '';
        // this.ingredients.forEach(elt => {
        //     let ingredient = elt.ingredient;
        //     let quantity = `: ${elt.quantity}`;
        //     let unit = elt.unit;
        //     if (quantity === undefined || unit === undefined) {
        //         quantity = "";
        //         unit = "";
        //     }
        //     //elt[Object.keys(elt)[0]]
        //     //Object.keys(elt)[0]
        //     console.log(ingredients)
        //     concatIngredients += `<p class="recipes__ingr">${ingredient} <span>${quantity} ${unit}</span></p>`
        // });
        // return concatIngredients;
    }

    ingredientsListHTML(arrayIng) {
        return `<li class="search__item">${arrayIng}</li>`;
    }

    templateRecipes() {
        return `<section class="recipes">
        <div class="recipes__img"></div>
        <div class="recipes__info">
            <div class="recipes__title">
                <p class="recipes__name">${this.name}</p>
                <div. class="recipes__clock"><span class="fas fa-clock"></span><p class="recipes__time">${this.time} min</p></div.>
            </div>
            <div class="recipes__left">
                <div class="recipes__ingr">${this.ingredientsHTML()}</div>
            </div>
            <div class="recipes__right">
                <div class="recipes__txt">${this.description}</div>
            </div>
        </div></section>`;
    }
}