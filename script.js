// const menuItems = document.querySelector(".menu-items");
// const confirmationSection = document.querySelector(".confirmation-section");


async function getData() {
    const url = "http://yumyum-assets.s3-website.eu-north-1.amazonaws.com/";
    try {
        const response = await fetch(url);
        console.log(response);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status} - ${response.statusText}`);
        }
    
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}
  
getData()
