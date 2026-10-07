import { menu } from "./menu.js";
const ticketId = document.querySelector("#ticket-id");
const formules = [{
  name: "formule déjeuner",
  discount: 100, 
  formuleElement: {
    "drink": 1,
    "pastry": 1
  }
}]
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

// Show toast
const toast = document.createElement("div");
toast.id = "toast";
document.body.appendChild(toast);
const showToast = (message) => {
  if (typeof message !== "string") return;
  toast.textContent = message;
  toast.classList.add("toast-active");
  setTimeout(() => {
    toast.classList.remove("toast-active");
  }, 1000);
};

// Étape 1 · Afficher la carte
const menuList = document.querySelector("#menu");
const renderMenu = (category = "all") => {
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
      menuByCategory[index].category || "Catégorie introuvable";

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

// Étape 3 · L'objet order
const order = {
  lines: [],
  discount: 0,
  ticketId: 1,
  calcDiscount: function(){
    const numberDrinks = this.lines.filter((item) => item.category === "tea" || item.category === "coffee").reduce((accumulator, current) => accumulator + current.quantity, 0);
    const numberPastry = this.lines.filter((item) => item.category === "pastry").reduce((accumulator, current) => accumulator + current.quantity, 0);
    const discount = formules.reduce((accumulator, current) => accumulator + (Math.min(numberDrinks, numberPastry) * current.discount), 0);
    return discount; 
  },
  getTotalDiscount: function () { 
    return this.calcDiscount() + Math.round((this.getSubtotal() - this.calcDiscount()) * this.discount); 
  }, 
  handleCashIn: function () {
    this.ticketId += 1;
    this.lines = [];
    this.discount = 0; 
    ticketId.textContent = this.ticketId;
    renderTicket();
  },
  add: function (product) {
    if (!product) return;
    if (!product.available) {
      showToast("Produit épuisé");
      return;
    }
    let targetProduct = this.lines.find((item) => item.id === product.id);
    if (targetProduct) {
      targetProduct.quantity += 1;
    } else {
      this.lines.push({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        quantity: 1,
      });
    }
    renderTicket();
  },
  getSubtotal: function () {
    const sum = this.lines.reduce(
      (accumulator, current) => accumulator + current.price * current.quantity,
      0,
    );
    return sum;
  },
  // Étape 5 · Retirer une ligne
  remove: function (id) {
    if (!id) return;
    let targetProduct = this.lines.find((item) => item.id === id);
    let index = this.lines.findIndex((item) => item.id === id);
    targetProduct.quantity -= 1;
    if (index > -1 && targetProduct.quantity < 1) {
      this.lines.splice(index, 1);
    }
    renderTicket();
  },
};

// Étape 4 · Afficher le ticket

const ticketLines = document.querySelector("#ticket-lines");
const ticketEmpty = document.querySelector("#ticket-empty");
const ticketTotal = document.querySelector("#ticket-total");
const ticketDiscount = document.querySelector("#ticket-discount");
ticketDiscount.textContent = formatPrice(order.getTotalDiscount()); 

const renderTicket = () => {
  ticketLines.textContent = "";
  ticketTotal.textContent = "0,00 €";
  order.lines.length > 0
    ? ticketEmpty.classList.add("is-hidden")
    : ticketEmpty.classList.remove("is-hidden");
  for (let index = 0; index < order.lines.length; index++) {
    let line = order.lines[index];
    const ticketLine = document.createElement("li");
    ticketLine.classList.add("ticket-line");
    ticketLine.id = `ticket-${line || index}`;

    const lineName = document.createElement("span");
    lineName.classList.add("line-name");
    lineName.textContent = line.name;

    const lineQty = document.createElement("span");
    lineQty.classList.add("line-qty");
    lineQty.textContent = `× ${line.quantity}`;

    const linePrice = document.createElement("span");
    linePrice.classList.add("line-price");
    linePrice.textContent = formatPrice(line.price * line.quantity);

    const lineRemove = document.createElement("button");
    lineRemove.classList.add("line-remove");
    lineRemove.textContent = "-";
    lineRemove.type = "button";
    lineRemove.ariaLabel = "Retirer un Cappuccino";
    lineRemove.addEventListener("click", () => order.remove(line.id));

    ticketLines.appendChild(ticketLine);
    ticketLine.append(lineName, lineQty, linePrice, lineRemove);
  }
  ticketDiscount.textContent = formatPrice(order.getTotalDiscount()); 
  ticketTotal.textContent = formatPrice(order.getSubtotal() - order.getTotalDiscount()); 
};

// Étape 6 · Filtrer par catégorie

renderMenu();
const categoriesNav = document.querySelector("#categories");
const buttonsCategoriesNav = document.querySelectorAll("#categories > button");
categoriesNav.addEventListener("click", (e) => {
  renderMenu(e.target.value);
  buttonsCategoriesNav.forEach((button) => {
    button.classList.remove("is-active");
  });

  e.target.classList.add("is-active");
});

// Étape 7 · Le prénom du client
const customerError = document.querySelector("#customer-error");
const customerName = document.querySelector("#customer-name");
const customerForm = document.querySelector("#customer-form");
const ticketTitle = document.querySelector("#ticket-title");
const handleSubmit = (e) => {
  e.preventDefault();
  if (!customerName.value) {
    customerError.textContent = "Veuillez rentrer un nom.";
    setTimeout(() => {
      customerError.textContent = "";
    }, 1000);
    return;
  }
  ticketTitle.textContent = `Ticket de ${customerName.value}`;
};
customerForm.addEventListener("submit", handleSubmit);
// Étape 8 · Le code promo
const promoCode = "BARISTA";
const promoForm = document.querySelector("#promo-form");
const promoCodeValue = document.querySelector("#promo-code");
const promoMessage = document.querySelector("#promo-message");
const applyPromoCode = (e) => {
  e.preventDefault();
  promoMessage.textContent = "";
  renderTicket();
  if (
    !promoCodeValue ||
    promoCodeValue.value.toUpperCase() !== promoCode.toUpperCase()
  ) {
    promoMessage.textContent = "Code inconnu";
    return;
  }
  order.discount = 0.1;
  renderTicket();
};
promoForm.addEventListener("submit", applyPromoCode);
// Bonus
const checkout = document.querySelector("#checkout");
checkout.addEventListener("click", () => order.handleCashIn());

