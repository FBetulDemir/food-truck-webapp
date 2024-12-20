import { renderMenu } from "./renderMenu.js";


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
    // console.log('Fetched Menu Data:', menuData);
    return menuData;
    
  } catch (error) {
    console.error('Failed to fetch menu data:', error.message);
  }
}

const menuData = fetchMenu(apiKey);

  
(async function initMenu() {
  const menuData = await fetchMenu(apiKey);

  if (menuData && menuData.items) {
    renderMenu(menuData.items);
  } else {
    console.error('Menu data is not in the expected format or is empty.');
  }
})();

