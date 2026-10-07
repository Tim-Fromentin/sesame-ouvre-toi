import { order } from "./order.js";
import { formatPrice } from "./utils.js";

const ticketLines = document.querySelector("#ticket-lines");
const ticketEmpty = document.querySelector("#ticket-empty");
const ticketTotal = document.querySelector("#ticket-total");
const ticketDiscount = document.querySelector("#ticket-discount");
const ticketId = document.querySelector("#ticket-id");

export const renderTicket = () => {
  ticketId.textContent = order.ticketId;
  ticketLines.textContent = "";
  ticketTotal.textContent = "0,00 €";
  order.lines.length > 0
    ? ticketEmpty.classList.add("is-hidden")
    : ticketEmpty.classList.remove("is-hidden");
  for (let index = 0; index < order.lines.length; index++) {
    let line = order.lines[index];
    const ticketLine = document.createElement("li");
    ticketLine.classList.add("ticket-line");
    ticketLine.id = `ticket-${line.id || index}`;

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
    lineRemove.ariaLabel = `Retirer un ${line.name}`;
    lineRemove.addEventListener("click", () => order.remove(line.id));

    ticketLines.appendChild(ticketLine);
    ticketLine.append(lineName, lineQty, linePrice, lineRemove);
  }
  ticketDiscount.textContent = formatPrice(order.getTotalDiscount());
  ticketTotal.textContent = formatPrice(
    order.getSubtotal() - order.getTotalDiscount(),
  );
};
