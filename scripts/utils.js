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

export const translate = (array, name) => {
  const wordTranslate = array.find(
    (item) => item.en.toUpperCase() === name.toUpperCase(),
  );
  if (wordTranslate) {
    return wordTranslate.fr;
  }
};
