# Natalie's Dashboard

## Project Description

Natalie's Dashboard is a responsive personal dashboard built with semantic HTML, CSS custom properties, and vanilla JavaScript. It combines three small widgets in one light/dark-mode interface: weather, Taylor Swift quotes and song titles, and personal tasks.

## Widgets

### Sample Weather

The weather widget shows current Fort Worth conditions. It fetches live weather from Open-Meteo, with `data/weather.json` available as a local fallback. A loading spinner appears during the request, and a friendly error state appears if both sources fail.

### Daily Taylor

The Taylor widget fetches random speech quotes and song titles from `data/quotes.json`. It never shows the same entry twice in a row, and the Shuffle button stays disabled until the quote data finishes loading.

### Tasks

The tasks widget lets users create, complete, and delete personal tasks. Tasks are stored in `localStorage` under `dashboardTasks`, so they persist across reloads. The widget also shows total, completed, pending, and completion-percentage statistics.

## Features

- Light and dark themes with a saved preference
- Accessible skip link, focus states, and reduced-motion support
- Responsive mobile, tablet, and desktop layout
- Loading and error states for fetched data
- Persistent task data with progress statistics

## Technologies

- HTML5
- CSS3 custom properties
- Vanilla JavaScript
- Open-Meteo API
- GitHub Pages

## Live Site

The dashboard is published at: https://nataliemagee13.github.io/dashboard/

## Local Development

Serve the project with a local web server so the JSON files and fetch requests can load, for example:

```text
python3 -m http.server
```

Then open `http://localhost:8000/` in a browser.

## AI Assistant

GitHub Copilot was used as an AI assistant during development to help with implementation, refactoring, accessibility improvements, and testing ideas. The project code and decisions were reviewed in the workspace.