import { menu } from "./menu.js";

// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier.
function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

// Étape 1 · Afficher la carte
console.log("menu", menu);
const menuList = document.querySelector("#menu");
const renderMenu = () => {
  for (let index = 0; index < menu.length; index++) {
    //     <article class="product">
    //   <span class="product-category">Café</span>
    //   <h3 class="product-name">Espresso</h3>
    //   <p class="product-price">2,20 €</p>
    //   <button type="button" class="product-add">Ajouter</button>
    // </article>
    const articleProduct = document.createElement("article");
    articleProduct.classList.add("product");
    articleProduct.id = `product-${menu[index].id || index}`;
    const spanProductCategory = document.createElement("span");
    spanProductCategory.classList.add("product-category");
    spanProductCategory.textContent =
      menu[index].category || "Catégorie introuvable";
    const productName = document.createElement("h3");
    productName.classList.add("product-name");
    productName.textContent = menu[index].name || "Produit introuvable";
    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    productPrice.textContent = menu[index].price;
    const productAddBtn = document.createElement("button");
    productAddBtn.classList.add("product-add");
    productAddBtn.textContent = "Ajouter";
    productAddBtn.type = "button"

    menuList.appendChild(articleProduct);
    articleProduct.append(
      spanProductCategory,
      productName,
      productPrice,
      productAddBtn,
    );
  }
};

renderMenu();

// Étape 2 · Les produits épuisés

// Étape 3 · L'objet order

// Étape 4 · Afficher le ticket

// Étape 5 · Retirer une ligne

// Étape 6 · Filtrer par catégorie

// Étape 7 · Le prénom du client

// Étape 8 · Le code promo

// Bonus
