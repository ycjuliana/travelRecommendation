document.addEventListener('DOMContentLoaded', function() {
const searchBtnEle = document.getElementById('nav-search-btn');
const clearBtnEle = document.getElementById('nav-clear-btn');
const navInputEle = document.getElementById('nav-input-id');
const bookNowBtn = document.getElementById('book-now-btn');
const searchResultDiv = document.getElementById('search-result-id');
const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
const newYorkTime = new Date().toLocaleTimeString('en-US', options);
console.log("Current time in New York:", newYorkTime);

searchBtnEle.addEventListener('click', function () {
    searchDestination(navInputEle.value);
});

clearBtnEle.addEventListener('click', function () {
    navInputEle.value = "";
    searchResultDiv.innerHTML = '';
});

navInputEle.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchDestination(navInputEle.value);
    }
  });

function searchDestination(keyword) {
    let searchResult;
    fetch("./travel_recommendation_api.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            for (let key in data) {
                if (key.includes(keyword.toLowerCase())) {
                    searchResult = data[key];
                }
            }
            if (!searchResult) {
                data.countries.forEach(country => {
                    if (country.name.toLowerCase().includes(keyword.toLowerCase())) {
                        searchResult = country.cities;
                    }
                })
            }
			
            showSearchResult(searchResult);
            return searchResult;
        })
        .catch((error) =>
            console.error("Unable to fetch data:", error));
}

function showSearchResult(searchResult) {
    searchResultDiv.innerHTML = '';
    searchResult.forEach(item => {
        const searchResEleDiv = document.createElement('div');
        searchResEleDiv.classList.add('search-result-element');

        searchResEleDiv.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <h2>${item.name}</h2>
        <p>${item.description}</p>
        <button>Visit</button>
      `;
        searchResultDiv.appendChild(searchResEleDiv);
    });
}});