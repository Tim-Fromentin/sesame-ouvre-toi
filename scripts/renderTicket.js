import { order } from "./order.js";
import { formatPrice } from "./utils.js";
import { createElements } from "./utils.js";

const ticketLines = document.querySelector("#ticket-lines");
const ticketEmpty = document.querySelector("#ticket-empty");
const ticketTotal = document.querySelector("#ticket-total");
const ticketDiscount = document.querySelector("#ticket-discount");
const ticketId = document.querySelector("#ticket-id");

export const renderTicket = (onRemove) => {
  ticketId.textContent = order.ticketId;
  ticketLines.textContent = "";
  ticketTotal.textContent = "0,00 €";
  order.lines.length > 0
    ? ticketEmpty.classList.add("is-hidden")
    : ticketEmpty.classList.remove("is-hidden");
  for (let index = 0; index < order.lines.length; index++) {
    let line = order.lines[index];
    const elements = [
      {
        tag: "li",
        className: "ticket-line",
        id: `ticket-${line.id || index}`,
      },
      {
        tag: "span",
        className: "line-name",
        textContent: line.name,
      },
      {
        tag: "span",
        className: "line-qty",
        textContent: `× ${line.quantity}`,
      },
      {
        tag: "span",
        className: "line-price",
        textContent: formatPrice(line.price * line.quantity),
      },
      {
        tag: "button",
        className: "line-remove",
        textContent: "-",
        type: "button",
        ariaLabel: `Retirer un ${line.name}`,
        eventListener: {
          type: "click",
          callback: () => onRemove(line.id),
        },
      },
    ];
    const [ticketLine, lineName, lineQty, linePrice, lineRemove] =
      createElements(elements);

    ticketLines.appendChild(ticketLine);
    ticketLine.append(lineName, lineQty, linePrice, lineRemove);
  }
  ticketDiscount.textContent = formatPrice(order.getTotalDiscount());
  ticketTotal.textContent = formatPrice(
    order.getSubtotal() - order.getTotalDiscount(),
  );
};
