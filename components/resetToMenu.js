export function resetToMenu() {

  cart = {};
  itemCount = 0;
  renderCart();
  cartCount.textContent = "0";


  receiptSection.classList.add("hidden");
  confirmationSection.classList.add("hidden");
  menuSection.classList.remove("hidden");
}


