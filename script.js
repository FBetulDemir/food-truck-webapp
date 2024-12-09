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

const menuData = fetchMenu(apiKey);


export function renderMenu(menuData) {
  const wontonItems = document.getElementById('wontonItems');
  const dipItems = document.getElementById('dipItems');
  const drinkItems = document.getElementById('drinkItems');

  
  wontonItems.innerHTML = '';
  dipItems.innerHTML = '';
  drinkItems.innerHTML = '';

  menuData.forEach((item) => {
    const menuItem = document.createElement('div');
    menuItem.classList.add('menu-item');
   
    if (item.type === 'wonton') {
      menuItem.innerHTML = `
      <div class = "wonton">
        <h3>${item.name}  ...............................  <strong>${item.price} SEK</strong></h3>
        <p>${item.ingredients}</p>
        <p></p>
      </div>
    `;

      wontonItems.appendChild(menuItem);
    } else if (item.type === 'dip') {
      const dipPrice = document.querySelector(".dips-title");
      dipPrice.innerHTML= `<h3>Dipsås  ...............................  <strong>${item.price} SEK</strong></h3>`
      menuItem.innerHTML = `
        <div class="dips-drinks">
          <p>${item.name}</p>
        </div>
      `;
      dipItems.appendChild(menuItem);
    } else if (item.type === 'drink') {
      const drinkPrice = document.querySelector(".drinks-title");
      drinkPrice.innerHTML= `<h3>Dricka  ...............................  <strong>${item.price} SEK</strong></h3>`
      menuItem.innerHTML = `
        <div class="dips-drinks">
          <p>${item.name}</p>
        </div>
      `;
      drinkItems.appendChild(menuItem);
    }
  });
}


  
(async function initMenu() {
  const menuData = await fetchMenu(apiKey);

  if (menuData && menuData.items) {
    renderMenu(menuData.items);
  } else {
    console.error('Menu data is not in the expected format or is empty.');
  }
})();

