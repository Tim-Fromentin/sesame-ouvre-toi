export const formatPrice = (cents) => {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
};

export const showErrorMsg = (errorMsg, target) => {
  const p = document.createElement("p");
  p.classList.add("error");
  p.textContent = errorMsg;
  target.appendChild(p);
};

export const showToast = (message) => {
  const toast = document.querySelector("#toast");
  if (typeof message !== "string") return;
  toast.textContent = message;
  toast.classList.add("toast-active");
  setTimeout(() => {
    toast.classList.remove("toast-active");
  }, 1000);
};

export const translate = (object, name) => {
  const wordTranslate = object.find(
    (item) => item.en.toUpperCase() === name.toUpperCase(),
  );
  if (wordTranslate) {
    return wordTranslate.fr;
  }
};

export const createElements = (elements) => {
  return elements.map((element) => {
    const el = document.createElement(element.tag);
    if (element.className) {
      if (Array.isArray(element.className)) {
        element.className.forEach((name) => el.classList.add(name));
      } else {
        el.classList.add(element.className);
      }
    }
    if (element.id) el.id = element.id;
    if (element.textContent) el.textContent = element.textContent;
    if (element.type) el.type = element.type;
    if (element.ariaLabel) el.ariaLabel = element.ariaLabel;
    if (element.disabled) el.disabled = true;
    if (element.eventListener) {
      el.addEventListener(
        element.eventListener.type,
        element.eventListener.callback,
      );
    }
    return el;
  });
};
