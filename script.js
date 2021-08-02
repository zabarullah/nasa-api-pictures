const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// Nasa Api
const count = 10;
const apiKey = `DEMO_KEY`;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`; // used the Apod api from nasa website

let resultsArray = [];
let favourites = {}; // using an empty object here so that we can easily delete a favourite without having to loop through (like you would for an array)

function showContent(page) {
    window.scrollTo({top: 0, behavior: 'instant'}); // when we press load more link page will scrol to the top instantly to show fresh content
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favouritesNav.classList.add('hidden');    
    } else {
        resultsNav.classList.add('hidden');
        favouritesNav.classList.remove('hidden');    
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    // console.log(page);
    const currentArray = page === 'results' ?  resultsArray : Object.values(favourites);
    // console.log('Current Array', page, currentArray);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank'
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add To Favourites';
            saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove To Favourites';
            saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : `Copyrights: ${result.copyright}`; // for when there is no copyright details
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append in correct order
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        // console.log(card);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    // Get favourites from local storage
    if (localStorage.getItem('NasaFavourites')) {
        favourites = JSON.parse(localStorage.getItem('NasaFavourites'));
        // console.log('Favourites from local storage', favourites);
    }
    imagesContainer.textContent = ''; // this line will clear the content so that a fresh data is appended (i.e. when deleting a favourite)
    createDOMNodes(page);
    showContent(page);
}
// Add result to favourites
function saveFavourite(itemUrl) {
    // console.log(itemUrl);
    // Loop throught Results array to select Favourite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl]) { // need to use inlcude method since it is a string due to being part of object favourites.
            favourites[itemUrl]= item;
            // console.log(favourites);
            // console.log(JSON.stringify(favourites));
            // Show saved confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {               // setTimeout method is used to add a delay for 2 seconds to execute code within its function
                saveConfirmed.hidden = true;
            }, 2000);
            // Set favourites in local storage
            localStorage.setItem('NasaFavourites', JSON.stringify(favourites));
        }
    });
}

// Remove item from favourites

function removeFavourite(itemUrl) {
    if (favourites[itemUrl]) {
        delete favourites[itemUrl];
        // Set favourites in local storage
        localStorage.setItem('NasaFavourites', JSON.stringify(favourites));
        updateDOM('favourites');
    }
}

// Get 10 images from Nasa Api
async function getNasaPictures() {
    // Show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        // console.log(resultsArray);
        updateDOM('results');
    } catch (error) {
    //catch error here
    }
}


// On load
getNasaPictures();