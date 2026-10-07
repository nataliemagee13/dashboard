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
    const quoteDisplay = quote.type === 'song'
        ? `<small class="song-label">Song of the Day:</small>
           <p class="quote-text song-title">${quote.text}</p>
           <p class="quote-source">${quote.source}</p>`
        : `<blockquote class="quote-text">“${quote.text}”</blockquote>
           <p class="quote-author">— ${quote.author}<br><small class="quote-source">${quote.source}</small></p>`;
    document.getElementById('quote-display').innerHTML = quoteDisplay;
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
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading weather…</p></div>`;
        const liveWeatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=32.7555&longitude=-97.3308&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago';

        fetch(liveWeatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Live weather request failed: ${response.status}`);
                }
                return response.json();
            })
            .then(data => displayWeather(formatLiveWeather(data)))
        .catch(error => {
                console.error('Error loading live weather:', error);
                fetch('./data/weather.json')
                    .then(response => response.json())
                    .then(data => displayWeather(data))
                    .catch(fallbackError => {
                        console.error('Error loading fallback weather:', fallbackError);
                        displayWeatherError();
                    });
        });
}

    function getWeatherDescription(weatherCode) {
        const descriptions = {
            0: ['Clear', '☀️'],
            1: ['Mostly clear', '🌤️'],
            2: ['Partly cloudy', '⛅'],
            3: ['Overcast', '☁️'],
            45: ['Foggy', '🌫️'],
            48: ['Foggy', '🌫️'],
            51: ['Light drizzle', '🌦️'],
            53: ['Drizzle', '🌦️'],
            55: ['Heavy drizzle', '🌧️'],
            61: ['Light rain', '🌦️'],
            63: ['Rain', '🌧️'],
            65: ['Heavy rain', '🌧️'],
            71: ['Light snow', '🌨️'],
            73: ['Snow', '❄️'],
            75: ['Heavy snow', '❄️'],
            80: ['Rain showers', '🌦️'],
            81: ['Rain showers', '🌧️'],
            82: ['Heavy rain showers', '🌧️'],
            95: ['Thunderstorm', '⛈️'],
            96: ['Thunderstorms', '⛈️'],
            99: ['Thunderstorms', '⛈️']
        };

        return descriptions[weatherCode] || ['Current conditions', '🌡️'];
    }

    function formatLiveWeather(data) {
        const [condition, icon] = getWeatherDescription(data.current.weather_code);
        return {
            location: 'Fort Worth, TX',
            temperature: Math.round(data.current.temperature_2m),
            condition,
            icon,
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m)
        };
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

function loadTasks() {
    const tasksJSON = localStorage.getItem('dashboardTasks');
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
}

function addTask(taskText) {
    const tasks = loadTasks();
    tasks.push({ text: taskText, completed: false, id: Date.now() });
    saveTasks(tasks);
    displayTasks();
}

function toggleTask(index) {
    const tasks = loadTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    displayTasks();
}

function deleteTask(index) {
    const tasks = loadTasks();
    if (confirm(`Delete task: "${tasks[index].text}"?`)) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        displayTasks();
    }
}

function displayTasks() {
    const tasks = loadTasks();
    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    const completionPercentage = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);
    const taskStats = document.getElementById('task-stats');
    const taskList = document.getElementById('task-list');

    taskStats.textContent = `Total: ${tasks.length} | Completed: ${completedTasks.length} | Pending: ${pendingTasks.length} | Progress: ${completionPercentage}%`;
    taskList.replaceChildren();

    if (tasks.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'task-empty';
        emptyMessage.textContent = 'No tasks yet.';
        taskList.appendChild(emptyMessage);
        return;
    }

    tasks.forEach((task, index) => {
        const taskRow = document.createElement('div');
        taskRow.className = 'task-row';
        if (task.completed) {
            taskRow.classList.add('is-complete');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark ${task.text} complete`);
        checkbox.addEventListener('change', () => toggleTask(index));

        const taskLabel = document.createElement('span');
        taskLabel.className = 'task-label';
        taskLabel.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'task-delete';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(index));

        taskRow.append(checkbox, taskLabel, deleteButton);
        taskList.appendChild(taskRow);
    });
}

document.getElementById('task-form').addEventListener('submit', event => {
    event.preventDefault();
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();
    if (taskText) {
        addTask(taskText);
        taskInput.value = '';
        taskInput.focus();
    }
});

loadWeather();
loadQuotes();
displayTasks();