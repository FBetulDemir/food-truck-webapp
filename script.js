const menuItem = document.querySelectorAll(".menu-items");
const wontonItems = document.getElementById('wontonItems');
const dipItems = document.getElementById('dipItems');
const drinkItems = document.getElementById('drinkItems');
const cardIcon = document.querySelector(".cart-image");
const menuSection =document.querySelector(".menu-section");
const cartSection =document.querySelector(".cart-section");

let cart = {};

const apiKey = "yum-7BTxHCyHhzIME5TI";



export async function fetchMenu(apiKey) {
  const url = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-zocom': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const menuData = await response.json();
    console.log('Fetched Menu Data:', menuData);
    return menuData;
    
  } catch (error) {
    console.error('Failed to fetch menu data:', error.message);
  }
}


export function renderMenu(menuData) {

  wontonItems.innerHTML = '';
  dipItems.innerHTML = '';
  drinkItems.innerHTML = '';

  menuData.forEach((item) => {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    menuItem.setAttribute('data-id', item.id);
   
    if (item.type === 'wonton') {
      menuItem.innerHTML = `
        <div class="wonton">
          <h3 class="item-name">${item.name}  ...............................  <strong class="item-price">${item.price} SEK</strong></h3>
          <p>${item.ingredients}</p>
          <p></p>
        </div>
    `;
      wontonItems.appendChild(menuItem);

    } else if (item.type === 'dip') {
      const dipPrice = document.querySelector(".dips-title");
      dipPrice.innerHTML= `<h3>Dipsås  ...............................  <strong class="item-price">${item.price} SEK</strong></h3>`
      menuItem.innerHTML = `
        <div class="dips-drinks">
          <p class="item-name">${item.name}</p>
        </div>
      `;
      dipItems.appendChild(menuItem);

    } else if (item.type === 'drink') {
      const drinkPrice = document.querySelector(".drinks-title");
      drinkPrice.innerHTML= `<h3>Dricka  ...............................  <strong class="item-price">${item.price} SEK</strong></h3>`
      menuItem.innerHTML = `
        <div class="dips-drinks">
          <p class="item-name">${item.name}</p>
        </div>
      `;
      drinkItems.appendChild(menuItem);
    }
  });
  attachEventListeners()
}


  
(async function initMenu() {
  const menuData = await fetchMenu(apiKey);

  if (menuData && menuData.items) {
    renderMenu(menuData.items);
  } else {
    console.error('Menu data is not in the expected format or is empty.');
  }
})();


//cart icon event listener to switch between 2 pages

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

function attachEventListeners() {
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

      console.log(`Clicked item:`, item);
      addToCart(item);
    });
  });
}




function renderCart() {
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


  updateCartTotal();
}

function updateCartTotal() {
  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartTotalElement = document.getElementById("cartTotal");
  cartTotalElement.textContent = `${total} SEK`;
}
