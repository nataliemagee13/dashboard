"use strict";
function initializeTheme() {
    if (localStorage.getItem('dashboardTheme') === 'dark') {
        document.body.classList.add('theme-dark');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('theme-dark');
    localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
initializeTheme();

let allQuotes = [];
let currentQuoteIndex = -1;
const newQuoteButton = document.getElementById('new-quote-button');

function displayRandomQuote() {
    if (allQuotes.length === 0) {
        document.getElementById('quote-display').textContent = 'No quotes to show';
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * allQuotes.length);
    } while (randomIndex === currentQuoteIndex && allQuotes.length > 1);

    currentQuoteIndex = randomIndex;
    const quote = allQuotes[randomIndex];
    document.getElementById('quote-display').innerHTML = `
        <blockquote class="quote-text">“${quote.text}”</blockquote>
        <p class="quote-author">— ${quote.author}<br><small class="quote-source">${quote.source}</small></p>`;
}

function displayQuotesError() {
    document.getElementById('quote-display').textContent =
        "Sorry, the quotes couldn't load right now. Try refreshing the page.";
}

function loadQuotes() {
    fetch('./data/quotes.json')
        .then(response => response.json())
        .then(quotes => {
            allQuotes = quotes;
            displayRandomQuote();
            if (allQuotes.length > 0) {
                newQuoteButton.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            displayQuotesError();
        });
}

newQuoteButton.addEventListener('click', displayRandomQuote);

function loadWeather() {
    fetch('./data/weather.json')
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error loading weather:', error);
            displayWeatherError();
        });
}

function displayWeather(weather) {
    document.getElementById('weather-display').innerHTML = `
        <div class="weather-current">
            <div class="weather-icon">${weather.icon}</div>
            <div class="weather-temp">${weather.temperature}°F</div>
            <div class="weather-location">${weather.location}</div>
            <div class="weather-condition">${weather.condition}</div>
        </div>`;
}

function displayWeatherError() {
    document.getElementById('weather-display').innerHTML =
        `<p class="widget-error">Sorry, the weather couldn't load right now. Try refreshing the page.</p>`;
}

loadWeather();
loadQuotes();