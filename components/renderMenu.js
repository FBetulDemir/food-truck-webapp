import { attachEventListeners } from "../script.js";

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