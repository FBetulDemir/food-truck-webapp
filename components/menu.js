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

    menuItem.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p><strong>${item.price} SEK</strong></p>
      </div>
    `;

   
    if (item.type === 'wonton') {
      wontonItems.appendChild(menuItem);
    } else if (item.type === 'dip') {
      dipItems.appendChild(menuItem);
    } else if (item.type === 'drink') {
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

