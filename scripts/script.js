import { renderMenu } from "./renderMenu.js";
import { renderTicket } from "./renderTicket.js";
import { renderTicketHistory } from "./renderTicketHistory.js";
import { order } from "./order.js";
import { formatPrice, showToast } from "./utils.js";

const customerError = document.querySelector("#customer-error");
const customerName = document.querySelector("#customer-name");
const customerForm = document.querySelector("#customer-form");
const ticketTitle = document.querySelector("#ticket-title");
const buttonsCategoriesNav = document.querySelectorAll("#categories > button");
const promoCode = "BARISTA";
const promoForm = document.querySelector("#promo-form");
const promoCodeValue = document.querySelector("#promo-code");
const promoMessage = document.querySelector("#promo-message");
const categoriesNav = document.querySelector("#categories");
const btnCheckout = document.querySelector("#checkout");

const handleCheckout = () => {
  const objectCashIn = order.handleCashIn();
  if (!objectCashIn) {
    showToast("Choissisez au moins un produit");
    return;
  }
  showToast(`Total ${formatPrice(objectCashIn.total)}`);
  refreshTicket();
  renderTicketHistory();
  handleClear();
};

const handleClear = () => {
  customerName.value = "";
  promoCodeValue.value = "";
  ticketTitle.textContent = "Ticket";
  promoMessage.textContent = "";
};

const handleAdd = (product) => {
  if (!order.add(product)) {
    showToast("Produit épuisé");
    return;
  }
  refreshTicket();
};

const refreshTicket = () => {
  renderTicket(handleRemove);
};

const handleRemove = (id) => {
  order.remove(id);
  refreshTicket();
};

categoriesNav.addEventListener("click", (e) => {
  const clickedButton = e.target.closest("button");
  if (!clickedButton) return;

  renderMenu(clickedButton.value, handleAdd);
  buttonsCategoriesNav.forEach((button) => {
    button.classList.remove("is-active");
  });
  clickedButton.classList.add("is-active");
});

const handleSubmit = (e) => {
  e.preventDefault();
  order.customer = customerName.value.trim();
  if (!order.customer) {
    customerError.textContent = "Veuillez rentrer un nom.";
    setTimeout(() => {
      customerError.textContent = "";
    }, 1000);
    return;
  }
  ticketTitle.textContent = `Ticket de ${order.customer}`;
};
customerForm.addEventListener("submit", handleSubmit);

const applyPromoCode = (e) => {
  e.preventDefault();
  promoMessage.textContent = "";
  renderTicket(handleRemove);
  if (
    !promoCodeValue ||
    promoCodeValue.value.toUpperCase() !== promoCode.toUpperCase()
  ) {
    promoMessage.textContent = "Code inconnu";
    return;
  }
  order.discount = 0.1;
  order.save();
  renderTicket(handleRemove);
};
promoForm.addEventListener("submit", applyPromoCode);

btnCheckout.addEventListener("click", handleCheckout);

renderMenu("all", handleAdd);
refreshTicket();
renderTicketHistory();
