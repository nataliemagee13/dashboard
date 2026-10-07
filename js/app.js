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
    const quoteText = quote.type === 'song' ? `Song of the Day: ${quote.text}` : quote.text;
    document.getElementById('quote-display').innerHTML = `
        <blockquote class="quote-text">“${quoteText}”</blockquote>
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
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading weather…</p></div>`;
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