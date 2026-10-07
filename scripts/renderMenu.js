import { menu } from "../ressources/menu.js";
import { formatPrice, showErrorMsg, translate } from "./utils.js";
import { order } from "./order.js";
import { translateCategorie } from "../ressources/translate.js";
import { createElements } from "./utils.js";

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
          callback: () => order.add(product),
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
