import {attachQuantityListeners, updateCartTotal} from "../script.js";
import { cart } from '../script.js';

export function renderCart() {
    const cartContainer = document.querySelector(".cart-container");
    const cartTotalElement = document.getElementById("cartTotal");
  
  
    cartContainer.innerHTML = "";
  
  
    if (Object.keys(cart).length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalElement.textContent = "0 SEK";
      return;
    }
  
  
    Object.keys(cart).forEach((key) => {
      const item = cart[key];
  
  
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
  
      cartItem.innerHTML = `
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>${item.price} SEK</p>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <span>${item.quantity} stycken</span>
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
        </div>
      `;
  
      cartContainer.appendChild(cartItem);
      
    });
  
    attachQuantityListeners();
    updateCartTotal();
  };

