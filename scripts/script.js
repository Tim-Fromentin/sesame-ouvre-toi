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
  renderTicketTitle();
  promoMessage.textContent = "";
};

const renderTicketTitle = () => {
  ticketTitle.textContent = order.customer
    ? `Ticket de ${order.customer}`
    : "Ticket";
};

const restoreForm = () => {
  customerName.value = order.customer;
  renderTicketTitle();
  if (order.discount > 0) {
    promoCodeValue.value = promoCode;
    promoMessage.textContent = "Code appliqué : 10 % de remise";
  }
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
  if (!customerName.value.trim()) {
    customerError.textContent = "Veuillez rentrer un nom.";
    setTimeout(() => {
      customerError.textContent = "";
    }, 1000);
    return;
  }
  order.customer = customerName.value.trim();
  renderTicketTitle();
  order.save();
};
customerForm.addEventListener("submit", handleSubmit);

const applyPromoCode = (e) => {
  e.preventDefault();
  if (order.lines.length < 1) {
    promoMessage.textContent = "Ajoutez un produit avant d'appliquer un code";
    return;
  }

  const cleanPromoCode = promoCodeValue.value.trim().toUpperCase();
  if (cleanPromoCode === promoCode) {
    order.discount = 0.1;
    promoMessage.textContent = "Code appliqué : 10 % de remise";
  } else {
    order.discount = 0;
    promoMessage.textContent = "Code inconnu";
  }
  order.save();
  refreshTicket();
};

promoForm.addEventListener("submit", applyPromoCode);

btnCheckout.addEventListener("click", handleCheckout);

renderMenu("all", handleAdd);
refreshTicket();
renderTicketHistory();
restoreForm();
