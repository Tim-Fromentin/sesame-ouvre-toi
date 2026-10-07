import { menu } from "./menu.js";

// Fournie : transforme 220 en "2,20 €". Tu n'as pas à la modifier.
function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

// Error message
const showErrorMsg = (errorMsg, target) => {
  const p = document.createElement("p");
  p.classList.add("error");
  p.textContent = errorMsg;
  target.appendChild(p);
};

// Étape 1 · Afficher la carte
const menuList = document.querySelector("#menu");
const renderMenu = () => {
  if (!Array.isArray(menu)) {
    console.error("An error has occurred");

    return;
  }
  menu.length < 1 ? showErrorMsg("Aucun plat n'a été trouvé.", menuList) : "";
  for (let index = 0; index < menu.length; index++) {
    // ============================= Article
    const articleProduct = document.createElement("article");
    articleProduct.classList.add("product");
    articleProduct.id = `product-${menu[index].id || index}`;

    // ============================= Product category
    const spanProductCategory = document.createElement("span");
    spanProductCategory.classList.add("product-category");
    spanProductCategory.textContent =
      menu[index].category || "Catégorie introuvable";

    // ============================= Product name
    const productName = document.createElement("h3");
    productName.classList.add("product-name");
    productName.textContent = menu[index].name || "Produit introuvable";

    // ============================= Product price
    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    productPrice.textContent = formatPrice(menu[index].price || 0);

    // ============================= Product button
    const productAddBtn = document.createElement("button");
    // Étape 2 · Les produits épuisés
    !menu[index].available
      ? (articleProduct.classList.add("is-sold-out"),
        (productAddBtn.disabled = true))
      : "";
    productAddBtn.classList.add("product-add");
    productAddBtn.textContent = "Ajouter";
    productAddBtn.type = "button";
    productAddBtn.addEventListener("click", () => order.add(menu[index]));

    menuList.appendChild(articleProduct);
    articleProduct.append(
      spanProductCategory,
      productName,
      productPrice,
      productAddBtn,
    );
  }
};

// Étape 3 · L'objet order
const order = {
  lines: [],
  add: function (product) {
    if (!product) return;
    let targetProduct = this.lines.find((item) => item.id === product.id);
    if (targetProduct) {
      targetProduct.quantity += 1;
    } else {
      this.lines.push({
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        quantity: 1,
      });
    }
    console.log(this.lines);
  },
  getSubtotal: function(){
    return;
  }
};



renderMenu();

// Étape 4 · Afficher le ticket

// Étape 5 · Retirer une ligne

// Étape 6 · Filtrer par catégorie

// Étape 7 · Le prénom du client

// Étape 8 · Le code promo

// Bonus
