// ============================= CREER la classe recette et ses méthodes =============================

export class Recipes {
    constructor({ id, name, servings, ingredients, time, description, appliance, ustensils }) {
        this.id = id;
        this.name = name;
        this.servings = servings;
        this.ingredients = ingredients;
        this.time = time;
        this.description = description;
        this.appliance = appliance;
        this.ustensils = ustensils;
    }

    isMatch(search) {
        if (this.isMatchTitle(search) || this.isMatchIngredient(search) || this.isMatchDescription(search)) {
            //console.log(this)
            return true;
        } else {
            return false;
        }
    }

    isMatchTitle(search) {
        if (this.name.toLowerCase().includes(search.toLowerCase())) {
            return true;
        } else {
            return false;
        }
    }

    isMatchIngredient(search) {
        let currentIngredient = this.ingredients;
        for (let i = 0; i < currentIngredient.length; i++) {
            //console.log(currentIngredient[i].ingredient)
            if (currentIngredient[i].ingredient.toLowerCase().includes(search.toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }
    }

    isMatchDescription(search) {
        if (this.description.toLowerCase().includes(search.toLowerCase())) {
            return true;
        } else {
            return false;
        }
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