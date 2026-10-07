import { formules } from "../ressources/formules.js";
import { renderTicket } from "./renderTicket.js";
import { showToast } from "./utils.js";
const ticketIdSaved = localStorage.getItem("sesame-ticket-id");
const linesSaved = localStorage.getItem("sesame-order");
const discountSaved = localStorage.getItem("sesame-discount");

export const order = {
  lines: JSON.parse(linesSaved) || [],
  discount: parseFloat(discountSaved) || 0,
  ticketId: parseFloat(ticketIdSaved) || 1,
  save: function () {
    localStorage.setItem("sesame-discount", JSON.stringify(this.discount));
    localStorage.setItem("sesame-order", JSON.stringify(this.lines));
    localStorage.setItem("sesame-ticket-id", JSON.stringify(this.ticketId));
  },
  calcDiscount: function () {
    const numberDrinks = this.lines
      .filter((item) => item.category === "tea" || item.category === "coffee")
      .reduce((accumulator, current) => accumulator + current.quantity, 0);
    const numberPastry = this.lines
      .filter((item) => item.category === "pastry")
      .reduce((accumulator, current) => accumulator + current.quantity, 0);
    const discount = formules.reduce(
      (accumulator, current) =>
        accumulator + Math.min(numberDrinks, numberPastry) * current.discount,
      0,
    );
    return discount;
  },
  getTotalDiscount: function () {
    return (
      this.calcDiscount() +
      Math.round((this.getSubtotal() - this.calcDiscount()) * this.discount)
    );
  },
  handleCashIn: function () {
    this.ticketId += 1;
    this.lines = [];
    this.discount = 0;
    renderTicket();
    this.save();
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
    this.save();
    renderTicket();
  },
  getSubtotal: function () {
    const sum = this.lines.reduce(
      (accumulator, current) => accumulator + current.price * current.quantity,
      0,
    );
    return sum;
  },
  remove: function (id) {
    if (!id) return;
    let targetProduct = this.lines.find((item) => item.id === id);
    let index = this.lines.findIndex((item) => item.id === id);
    targetProduct.quantity -= 1;
    if (index > -1 && targetProduct.quantity < 1) {
      this.lines.splice(index, 1);
    }
    this.save();
    renderTicket();
  },
};
