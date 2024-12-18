import { attachEventListeners } from "../script.js";


export function renderMenu(menuData) {

  wontonItems.innerHTML = '';
  dipItems.innerHTML = '';
  drinkItems.innerHTML = '';

  menuData.forEach((item) => {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
    menuItem.setAttribute('data-id', item.id);
    // console.log("Menu Item ID:", item.id, "Name:", item.name);


    if (item.type === 'wonton') {
      menuItem.innerHTML = `
        <div class="wonton">
          <div>
            <h3 class="item-name">
              ${item.name}
            </h3>
            <span class="bottom-dotted"></span>
            <strong class="item-price">${item.price} SEK</strong> 
          </div>

          <p>${item.ingredients}</p>
          <p class="bottom-lined"></p>
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