import { fetchMenu } from "./components/menu.js";
import { renderMenu } from "./components/renderMenu.js";
import {renderCart} from "./components/renderCart.js";
import { resetToMenu } from "./components/resetToMenu.js";

const menuItem = document.querySelectorAll(".menu-items");
const wontonItems = document.getElementById('wontonItems');
const dipItems = document.getElementById('dipItems');
const drinkItems = document.getElementById('drinkItems');
const cardIcon = document.querySelector(".cart-image");
const menuSection =document.querySelector(".menu-section");
const cartSection =document.querySelector(".cart-section");
const cartCount = document.querySelector(".cart-count");
const confirmationSection = document.querySelector(".confirmation-section");
const orderIdElement = document.getElementById("orderId");
const receiptSection = document.querySelector("#receiptSection");
const newOrderBtn = document.querySelector(".newOrderBtn");
const viewReceiptBtn = document.querySelector(".viewReceiptBtn");
const receiptContainer = document.querySelector(".receipt-container");
const receiptTotal = document.getElementById("receipt-total");


export let cart = {};
let itemCount = 0;

const apiUrl = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";
const apiKey = "yum-7BTxHCyHhzIME5TI";
let tenantId = "";


//cart icon event listener to switch between 2 pages (menu and cart pages)

cardIcon.addEventListener("click", ()=>{
  console.log("icon clicked")
  cartSection.classList.remove("hidden");
  menuSection.classList.add("hidden");

})

//Here starts the second page (cart)

function addToCart(item) {
  if (!cart[item.id]) {
    // If item does not exist in the cart, add it
    cart[item.id] = { ...item, quantity: 1 };
  } else {
    // If item already exists, increase the quantity
    cart[item.id].quantity += 1;
  }
  renderCart()
}

export function attachEventListeners() {
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", () => {
    
      const itemId = menuItem.getAttribute("data-id");
      const itemNameElement = menuItem.querySelector(".item-name");
      const itemName = itemNameElement ? itemNameElement.textContent : "";

      let itemPrice = 0;
      if (menuItem.closest("#dipItems")) {
        const dipPriceElement = document.querySelector(".dips-title");
        itemPrice = dipPriceElement
          ? parseInt(dipPriceElement.textContent.match(/(\d+)/)[0])
          : 0;
      } else if (menuItem.closest("#drinkItems")) {

        const drinkPriceElement = document.querySelector(".item-price");
        itemPrice = drinkPriceElement
          ? parseInt(drinkPriceElement.textContent.match(/(\d+)/)[0])
          : 0;
      } else {

        const itemPriceElement = menuItem.querySelector(".item-price");
        itemPrice = itemPriceElement
          ? parseInt(itemPriceElement.textContent.replace(" SEK", ""))
          : 0;
      }
  
      const item = { id: itemId, name: itemName, price: itemPrice };


      // this adds to red item count that is on the cart icon.
      itemCount ++;
      console.log (itemCount);
      cartCount.innerHTML = `${itemCount}`;
      console.log(`Clicked item:`, item);
      addToCart(item);
    });
  });
}


export function attachQuantityListeners() {
  const increaseButtons = document.querySelectorAll(".quantity-btn.increase");
  const decreaseButtons = document.querySelectorAll(".quantity-btn.decrease");

  increaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      cart[itemId].quantity += 1;
      renderCart();
    });
  });

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("data-id");
      if (cart[itemId].quantity > 1) {
        cart[itemId].quantity -= 1;
      } else {
        delete cart[itemId];
      }
      renderCart();
    });
  });
}

export function updateCartTotal() {
  const total = Object.values(cart).reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  const cartTotalElement = document.getElementById("cartTotal");
  cartTotalElement.textContent = `${total} SEK`;
}


async function registerTenant(baseName) {
  const url = `${apiUrl}/tenants`;
  const uniqueName = `${baseName}-${Date.now()}`;

  try {
    const bodyData = JSON.stringify({ name: uniqueName });
    console.log("Request Body:", bodyData);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-zocom": apiKey,
      },
      body: bodyData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    console.log("Registered Tenant:", result);
    return result.id;
  } catch (error) {
    console.error("Failed to register tenant:", error.message);
  }
}



async function placeOrder() {
  if (!tenantId) {
    console.error("Tenant ID is missing. Please register a tenant first.");
    return;
  }

  const orderItems = Object.values(cart).map((item) => Number(item.id)); // Fix payload

  if (orderItems.length === 0) {
    console.error("Cannot place an order. Cart is empty.");
    return;
  }

  const url = `${apiUrl}/${tenantId}/orders`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-zocom": apiKey,
      },
      body: JSON.stringify({ items: orderItems }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error(`Error placing order: ${response.status} - ${responseText}`);
      return;
    }

    const result = await response.json();
    console.log("Order successfully placed:", result);


    cart = {};
    renderCart();
    cartCount.textContent = "0";


    displayOrderConfirmation(result);
  } catch (error) {
    console.error("Failed to place order:", error.message);
  }
}


document.querySelector(".checkoutBtn").addEventListener("click", () => {
  placeOrder();
});


async function fetchOrders(apiKey, tenantId) {
  const url = `${apiUrl}/${tenantId}/orders`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-zocom": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching orders: ${response.status}`);
    }

    const orders = await response.json();
    console.log("Fetched Orders:", orders);
    return orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error.message);
  }
}



async function fetchOrdersByTenant() {
  if (!tenantId) {
    console.error("Tenant ID is missing. Cannot fetch orders.");
    return;
  }

  const url = `${apiUrl}/${tenantId}/orders`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-zocom": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching orders: ${response.status}`);
    }

    const orders = await response.json();
    console.log("Fetched Orders for Tenant:", orders);

    // Render or handle orders here
    renderOrderList(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error.message);
  }
}


function renderOrderList(orders) {
  const orderListContainer = document.querySelector(".confirmation-section");
  orderListContainer.innerHTML = "<h2>Fetched Orders</h2>";

  if (orders.length === 0) {
    orderListContainer.innerHTML += "<p>No orders found.</p>";
    return;
  }

  const orderHTML = orders
    .map(
      (order) => `
    <div>
      <h3>Order ID: ${order.id}</h3>
      <p>Total Value: ${order.orderValue} SEK</p>
      <ul>
        ${order.items
          .map(
            (item) =>
              `<li>${item.name} - Quantity: ${item.quantity}, Price: ${item.price} SEK</li>`
          )
          .join("")}
      </ul>
      <p>Status: ${order.state}</p>
    </div>
  `
    )
    .join("");

  orderListContainer.innerHTML += orderHTML;
}



(async function initApp() {
  const tenantName = "order";
  try {
    tenantId = await registerTenant(tenantName);

    if (tenantId) {
      console.log("Registered Tenant ID:", tenantId);


      const orders = await fetchOrders(apiKey, tenantId);
      console.log("Fetched Orders:", orders);
    } else {
      console.error("Failed to register tenant. Tenant ID is undefined.");
    }
  } catch (error) {
    console.error("Initialization error:", error.message);
  }
})();


async function fetchOrderById(orderId) {
  const url = `${apiUrl}/orders/${orderId}`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-zocom": apiKey, 
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching order: ${response.status} - ${response.statusText}`);
    }

    const orderDetails = await response.json();
    console.log("Fetched Order Details:", orderDetails);


    renderOrderDetails(result.id);
  } catch (error) {
    console.error("Failed to fetch order details:", error.message);
  }
}


function renderOrderDetails(order) {
  const orderDetailsContainer = document.querySelector(".confirmation-section");


  orderDetailsContainer.innerHTML = "";


  // const orderHTML = `
  //   <h2>Order ID: ${order.id}</h2>
  //   <p><strong>Total Price:</strong> ${order.total} SEK</p>
  //   <h3>Items Ordered:</h3>
  //   <ul>
  //     ${order.items
  //       .map(
  //         (item) => `
  //           <li>${item.name} - Quantity: ${item.quantity}, Price: ${item.price} SEK</li>
  //         `
  //       )
  //       .join("")}
  //   </ul>
  // `;


  // orderDetailsContainer.innerHTML = orderHTML;
}




function displayOrderConfirmation(response) {
  const orderDetails = response.order;

  if (!orderDetails || !orderDetails.id) {
    console.error("Order details are missing or invalid.");
    return;
  }

  console.log("Order Details for Confirmation:", orderDetails);

  cartSection.classList.add("hidden");
  confirmationSection.classList.remove("hidden");


  const confirmationText = document.createElement("p");
  confirmationText.textContent = "#";

  const orderIdSpan = document.createElement("span");
  orderIdSpan.id = "orderId"; 
  orderIdSpan.textContent = orderDetails.id;

  const orderIdSection = document.querySelector(".order-id");
  confirmationText.appendChild(orderIdSpan);
  orderIdSection.appendChild(confirmationText);


  viewReceiptBtn.addEventListener("click", () => {
    console.log("Fetching receipt for Order ID:", orderDetails.id);
    renderReceipt(orderDetails.id);
    renderOrderList(orderDetails.id)
  });

}




async function renderReceipt(orderId) {
  const url = `${apiUrl}/receipts/${orderId}`;
  console.log("Fetching receipt from URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-zocom": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching receipt: ${response.status}`);
    }

    const receipt = await response.json();
    console.log("Fetched Receipt:", receipt);


    const itemsHTML = receipt.items
      .map(
        (item) => `
          <li>
            ${item.name} - ${item.quantity} stycken ............................... ${item.price} SEK
          </li>`
      )
      .join("");

    receiptContainer.innerHTML = `
      <ul>
        ${itemsHTML}
      </ul>
    `;

    // Display total value
    receiptTotal.textContent = `${receipt.orderValue} SEK`;

    // Switch to receipt section
    confirmationSection.classList.add("hidden");
    receiptSection.classList.remove("hidden");
  } catch (error) {
    console.error("Failed to fetch receipt:", error.message);
  }
}


viewReceiptBtn.addEventListener("click", () => {
  renderReceipt();
});


newOrderBtn.addEventListener("click", () => {
  resetToMenu();
});


