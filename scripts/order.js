import { formules } from "../resources/formules.js";
import { parseJson } from "./utils.js";

const ticketIdSaved = localStorage.getItem("sesame-ticket-id");
const linesSaved = localStorage.getItem("sesame-order");
const ticketHistorySaved = localStorage.getItem("sesame-ticket-history");
const discountSaved = localStorage.getItem("sesame-discount");
const customerSaved = localStorage.getItem("sesame-customer");

export const order = {
  ticketHistory: parseJson(ticketHistorySaved) || [],
  lines: parseJson(linesSaved) || [],
  discount: parseFloat(discountSaved) || 0,
  ticketId: parseFloat(ticketIdSaved) || 1,
  customer: parseJson(customerSaved) || "",
  save: function () {
    localStorage.setItem("sesame-discount", JSON.stringify(this.discount));
    localStorage.setItem("sesame-customer", JSON.stringify(this.customer));
    localStorage.setItem("sesame-order", JSON.stringify(this.lines));
    localStorage.setItem("sesame-ticket-id", JSON.stringify(this.ticketId));
    localStorage.setItem(
      "sesame-ticket-history",
      JSON.stringify(this.ticketHistory),
    );
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
    if (this.lines.length < 1) {
      return null;
    }
    let ticketHistoryObject = {
      customer: this.customer,
      ticketId: this.ticketId,
      lines: this.lines,
      total: this.getSubtotal() - this.getTotalDiscount(),
    };
    this.ticketHistory.push(ticketHistoryObject);
    this.ticketId += 1;
    this.lines = [];
    this.customer = "";
    this.discount = 0;
    this.save();
    return ticketHistoryObject;
  },
  add: function (product) {
    if (!product || !product.available) return false;
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
    return true;
  },
  getSubtotal: function () {
    const sum = this.lines.reduce(
      (accumulator, current) => accumulator + current.price * current.quantity,
      0,
    );
    return sum;
  },
  remove: function (id) {
    const index = this.lines.findIndex((item) => item.id === id);
    if (index === -1) return;

    const line = this.lines[index];
    line.quantity -= 1;
    if (line.quantity < 1) {
      this.lines.splice(index, 1);
    }
    this.save();
  },
};
