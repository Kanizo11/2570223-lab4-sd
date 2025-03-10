document.getElementById('submit_button').addEventListener('click', function() {
    const countryName = document.getElementById('country_name').value.trim();
    if (countryName) {
        fetchCountryInfo(countryName);
    } else {
        alert('Please enter a country name.');
    }
});

function fetchCountryInfo(countryName) {
    const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(url).then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            displayCountryInfo(data[0]);
        })
        .catch(error => {
            displayError(error.message);
        });
}

function displayCountryInfo(country) {
    const countryInfoSection = document.getElementById('country-info');
    countryInfoSection.innerHTML = `
        <h3>${country.name.common}</h3>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Flag:</strong></p>
        <img src="${country.flags.svg}" alt="Flag" style="width: 100px;">
    `;

    if (country.borders) {
        displayNeighbouringCountries(country.borders);
    } else {
        const borderingCountriesSection = document.getElementById('bordering-countries');
        borderingCountriesSection.innerHTML = '<p>No neighboring countries found.</p>';
    }
}

function displayNeighbouringCountries(borders) {
    const borderingCountriesSection = document.getElementById('bordering-countries');
    borderingCountriesSection.innerHTML = '<h4>Bordering Countries:</h4><ul id="neighbours-list"></ul>';
    const neighboursList = document.getElementById('neighbours-list');
    borders.forEach(border => {
        const url = `https://restcountries.com/v3.1/alpha/${border}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const country = data[0];
                const listItem = document.createElement('li');
                const c_name =  country.name.common;
                listItem.innerHTML = `
                <p><strong>${c_name}:</strong></p>
                <img src="${country.flags.svg}" alt="Flag" style="width: 200px;">
                `;
                neighboursList.appendChild(listItem);
            })
            .catch(error => {
                console.error(`Error fetching neighbor country data: ${error}`);
            });
    });
}

function displayError(errorMessage) {
    const countryInfoSection = document.getElementById('country-info');
    countryInfoSection.innerHTML = `<p style="color:red;">Error: ${errorMessage}</p>`;
}
