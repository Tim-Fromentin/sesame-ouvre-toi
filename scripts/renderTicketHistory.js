import { order } from "./order.js";
import { createElements, formatPrice } from "./utils.js";
const ticketHistoryList = document.querySelector("#ticket-history");
export const renderTicketHistory = () => {
  for (let index = 0; index < order.ticketHistory.length; index++) {
    const elements = [
      {
        tag: "li",
      },
      {
        tag: "span",
        textContent: `Ticket ${order.ticketHistory[index].ticketId} : `,
      },
      {
        tag: "strong",
        textContent: formatPrice(order.ticketHistory[index].total),
      },
    ];
    createElements(elements);
    const [element, id, total] = createElements(elements);
    ticketHistoryList.appendChild(element);
    element.append(id, total);
  }
};
