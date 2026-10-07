import { renderMenu } from "./renderMenu.js";
import { renderTicket } from "./renderTicket.js";
import { order } from "./order.js";

const customerError = document.querySelector("#customer-error");
const customerName = document.querySelector("#customer-name");
const customerForm = document.querySelector("#customer-form");
const ticketTitle = document.querySelector("#ticket-title");
const categoriesNav = document.querySelector("#categories");
const buttonsCategoriesNav = document.querySelectorAll("#categories > button");
const promoCode = "BARISTA";
const promoForm = document.querySelector("#promo-form");
const promoCodeValue = document.querySelector("#promo-code");
const promoMessage = document.querySelector("#promo-message");

renderMenu();
renderTicket();
categoriesNav.addEventListener("click", (e) => {
  renderMenu(e.target.value);
  buttonsCategoriesNav.forEach((button) => {
    button.classList.remove("is-active");
  });

  e.target.classList.add("is-active");
});

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
  order.save();
  renderTicket();
};
promoForm.addEventListener("submit", applyPromoCode);

const checkout = document.querySelector("#checkout");
checkout.addEventListener("click", () => order.handleCashIn());
