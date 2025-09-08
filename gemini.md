# Project: How Long Since

## 1. Project Overview

"How Long Since" is a lightweight, single-page application (SPA) designed to help users track the time elapsed since they last performed a specific activity. It provides a simple, intuitive interface for managing categorized lists of items, setting target frequencies, and visualizing how long it has been since each item was last updated. The application is built with vanilla HTML, CSS, and JavaScript, with all data persisted in the browser's local storage.

## 2. Core Features

*   **Category Management:**
    *   Users can create new categories for organizing items.
    *   Categories can be renamed inline by clicking on the tab name.
    *   Categories can be deleted, which also removes all items within them.
*   **Item Management:**
    *   Users can add new items to any existing category.
    *   Each item has a name, a target frequency (in weeks), and the date it was last done.
    *   Items can be edited or deleted via a modal interface.
    *   Users can quickly mark an item as "Done Today" to update its `lastSeen` date.
*   **Visual Cues:**
    *   The main list displays the difference between the target frequency and the actual time elapsed in weeks.
    *   This difference is color-coded to indicate status:
        *   **Green (`ahead`):** The activity was performed more recently than its target frequency.
        *   **Yellow (`due`):** The activity is due to be performed.
        *   **Red (`overdue`):** The activity is overdue.
*   **Data Persistence:**
    *   All application data (categories and items) is stored in the browser's `localStorage`, ensuring that information is saved between sessions.

## 3. Technical Architecture

The application follows a simple, client-side architecture with a clear separation of concerns between data management and UI rendering.

*   **Frontend:**
    *   **HTML (`index.html`):** Provides the basic structure of the application, including the tab container, item list, and the modals for editing items.
    *   **CSS (`css/style.css`):** Styles the application for a clean, modern, and responsive user interface.
    *   **JavaScript:** The core logic is split into two modules:
        *   `js/data.js`: Handles all state management and business logic. This includes functions for loading from and saving to `localStorage`, as well as all CRUD (Create, Read, Update, Delete) operations for both categories and items.
        *   `js/ui.js`: Manages all DOM manipulation and user interaction. It listens for events, calls the appropriate functions in `data.js`, and re-renders the UI to reflect state changes.
*   **Data Storage:**
    *   **Local Storage:** The application state is stored as a single JSON object in the browser's `localStorage` under the key `howLongSinceState`. This makes the application entirely self-contained and serverless.
*   **Build & Deployment:**
    *   The project is configured for deployment as a static website on Google Cloud Storage.
    *   A `cloudbuild.yaml` file defines a simple CI/CD pipeline with Google Cloud Build, which automatically deploys the application upon a push to the `master` branch.
    *   A shell script (`start-local.sh`) is provided to run a simple Python web server for local development.
