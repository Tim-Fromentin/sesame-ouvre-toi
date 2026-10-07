import { menu } from "../ressources/menu.js";
import { formatPrice, showErrorMsg, translate } from "./utils.js";
import { order } from "./order.js";
import { translateCategorie } from "../ressources/translate.js";



const menuList = document.querySelector("#menu");
export const renderMenu = (category = "all") => {
  menuList.textContent = "";
  if (!Array.isArray(menu)) {
    console.error("An error has occurred");

    return;
  }
  let menuByCategory =
    category === "all"
      ? menu
      : menu.filter((article) => article.category === category);

  menuByCategory.length < 1
    ? showErrorMsg("Aucun plat n'a été trouvé.", menuList)
    : "";
  for (let index = 0; index < menuByCategory.length; index++) {
    // ============================= Article
    const articleProduct = document.createElement("article");
    articleProduct.classList.add("product");
    articleProduct.id = `product-${menuByCategory[index].id || index}`;

    // ============================= Product category
    const spanProductCategory = document.createElement("span");
    spanProductCategory.classList.add("product-category");
    spanProductCategory.textContent =
      translate(translateCategorie, menuByCategory[index].category);

    // ============================= Product name
    const productName = document.createElement("h3");
    productName.classList.add("product-name");
    productName.textContent =
      menuByCategory[index].name || "Produit introuvable";

    // ============================= Product price
    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    productPrice.textContent = formatPrice(menuByCategory[index].price || 0);

    // ============================= Product button
    const productAddBtn = document.createElement("button");
    // Étape 2 · Les produits épuisés
    !menuByCategory[index].available
      ? (articleProduct.classList.add("is-sold-out"),
        (productAddBtn.disabled = true))
      : "";
    productAddBtn.classList.add("product-add");
    productAddBtn.textContent = "Ajouter";
    productAddBtn.type = "button";
    productAddBtn.addEventListener("click", () => {
      order.add(menuByCategory[index]);
    });

    menuList.appendChild(articleProduct);
    articleProduct.append(
      spanProductCategory,
      productName,
      productPrice,
      productAddBtn,
    );
  }
};
