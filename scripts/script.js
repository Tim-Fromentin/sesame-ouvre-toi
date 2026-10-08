import { renderMenu } from "./renderMenu.js";
import { renderTicket } from "./renderTicket.js";
import { renderTicketHistory } from "./renderTicketHistory.js";
import { order } from "./order.js";

const customerError = document.querySelector("#customer-error");
const customerName = document.querySelector("#customer-name");
const customerForm = document.querySelector("#customer-form");
const ticketTitle = document.querySelector("#ticket-title");
const buttonsCategoriesNav = document.querySelectorAll("#categories > button");
const promoCode = "BARISTA";
const promoForm = document.querySelector("#promo-form");
const promoCodeValue = document.querySelector("#promo-code");
const promoMessage = document.querySelector("#promo-message");

renderMenu();
renderTicket();
const categoriesNav = document.querySelector("#categories");

categoriesNav.addEventListener("click", (e) => {
  const clickedButton = e.target.closest("button");
  if (!clickedButton) return;

  renderMenu(clickedButton.value);
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

renderTicketHistory();
