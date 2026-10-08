import { menu } from "../resources/menu.js";
import { formatPrice, showErrorMsg, translate } from "./utils.js";
import { translateCategorie } from "../resources/translate.js";
import { createElements } from "./utils.js";

const menuList = document.querySelector("#menu");

const getMenuByCategory = (category) => {
  const menuByCategory =
    category === "all"
      ? menu
      : menu.filter((article) => article.category === category);
  return menuByCategory;
};

const verifyNotEmptyArray = (menuByCategory) => {
  if (menuByCategory.length < 1)
    showErrorMsg("Aucun plat n'a été trouvé.", menuList);
};

const createMenuElement = (menuByCategory, onAdd) => {
  for (let index = 0; index < menuByCategory.length; index++) {
    const product = menuByCategory[index];
    const isSoldOut = !product.available;

    const elements = [
      {
        tag: "article",
        className: isSoldOut ? ["product", "is-sold-out"] : ["product"],
        id: `product-${product.id || index}`,
      },
      {
        tag: "span",
        className: "product-category",
        textContent:
          translate(translateCategorie, product.category) ||
          "Catégorie introuvable",
      },
      {
        tag: "h3",
        className: "product-name",
        textContent: product.name || "Produit introuvable",
      },
      {
        tag: "p",
        className: "product-price",
        textContent: formatPrice(product.price || 0),
      },
      {
        tag: "button",
        className: "product-add",
        textContent: "Ajouter",
        type: "button",
        disabled: isSoldOut,
        eventListener: {
          type: "click",
          callback: () => onAdd(product),
        },
      },
    ];

    const [
      articleProduct,
      spanProductCategory,
      productName,
      productPrice,
      productAddBtn,
    ] = createElements(elements);

    menuList.appendChild(articleProduct);
    articleProduct.append(
      spanProductCategory,
      productName,
      productPrice,
      productAddBtn,
    );
  }
};
export const renderMenu = (category = "all", onAdd) => {
  menuList.textContent = "";
  if (!Array.isArray(menu)) {
    console.error("An error has occurred");
    return;
  }

  const menuByCategory = getMenuByCategory(category);
  verifyNotEmptyArray(menuByCategory);
  createMenuElement(menuByCategory, onAdd);
};
