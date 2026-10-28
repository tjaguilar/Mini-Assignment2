
/*
=========================================================
PIXEL QUEST GAMING WEBSITE
JavaScript functionality

This file handles:
1. Dark mode
2. Game library data
3. Searching and filtering games
4. Displaying the filtered games
5. Showing the number of results
6. Adding games to favorites
7. Validating the game suggestion form
8. Displaying a live character count
=========================================================
*/


/* =======================================================
   PART 1: SELECT HTML ELEMENTS
   ======================================================= */

// Find the dark mode button.
const themeToggle = document.getElementById("theme-toggle");

// Find the search input.
const gameSearch = document.getElementById("game-search");

// Find the genre dropdown.
const genreFilter = document.getElementById("genre-filter");

// Find the container where game cards will appear.
const gameList = document.getElementById("game-list");

// Find the text that displays how many games match.
const resultsCount = document.getElementById("results-count");

// Find the game suggestion form.
const suggestionForm = document.getElementById("suggestion-form");

// Find the areas used to display form errors and success messages.
const formError = document.getElementById("form-error");
const formSummary = document.getElementById("form-summary");

// Find the favorite games section.
const favoritesList = document.getElementById("favorites-list");

// Find the character count element, if it exists.
const suggestionName = document.getElementById("suggestion-name");
const characterCount = document.getElementById("character-count");

 /* =======================================================
   PART 2: GAME DATA
   Contains 20 games across four different genres.
   Each game has a unique ID and descriptive information.
======================================================= */

const games = [
    // ACTION GAMES
    {
        id: 1,
        title: "Fortnite",
        genre: "Action",
        platform: "PC, Console, Mobile",
        description: "Compete against other players in a battle royale.",
        rating: "Teen"
    },
    {
        id: 2,
        title: "Overwatch 2",
        genre: "Action",
        platform: "PC, Console",
        description: "Team up with heroes in fast-paced multiplayer battles.",
        rating: "Teen"
    },
    {
        id: 3,
        title: "Street Fighter 6",
        genre: "Action",
        platform: "PC, PlayStation, Xbox",
        description: "Battle opponents using special moves and combos.",
        rating: "Teen"
    },
    {
        id: 4,
        title: "Hades",
        genre: "Action",
        platform: "PC, Console",
        description: "Fight through the underworld in this action-packed adventure.",
        rating: "Teen"
    },
    {
        id: 5,
        title: "Marvel Rivals",
        genre: "Action",
        platform: "PC, Console",
        description: "Battle as Marvel heroes and villains in team matches.",
        rating: "Teen"
    },

    // ADVENTURE GAMES
    {
        id: 6,
        title: "Minecraft",
        genre: "Adventure",
        platform: "PC, Console, Mobile",
        description: "Explore, build, and survive in a world made of blocks.",
        rating: "Everyone 10+"
    },
    {
        id: 7,
        title: "Super Mario Odyssey",
        genre: "Adventure",
        platform: "Nintendo Switch",
        description: "Join Mario on a journey through colorful kingdoms.",
        rating: "Everyone 10+"
    },
    {
        id: 8,
        title: "The Legend of Zelda: Tears of the Kingdom",
        genre: "Adventure",
        platform: "Nintendo Switch",
        description: "Explore a vast world filled with puzzles and discoveries.",
        rating: "Everyone 10+"
    },
    {
        id: 9,
        title: "Hollow Knight",
        genre: "Adventure",
        platform: "PC, Console",
        description: "Explore a mysterious underground kingdom.",
        rating: "Everyone 10+"
    },
    {
        id: 10,
        title: "No Man's Sky",
        genre: "Adventure",
        platform: "PC, Console",
        description: "Explore planets and discover an enormous universe.",
        rating: "Teen"
    },

    // SPORTS GAMES
    {
        id: 11,
        title: "Rocket League",
        genre: "Sports",
        platform: "PC, Console",
        description: "Play soccer with rocket-powered cars.",
        rating: "Everyone"
    },
    {
        id: 12,
        title: "NBA 2K",
        genre: "Sports",
        platform: "PC, Console",
        description: "Play basketball and compete with teams and players.",
        rating: "Everyone"
    },
    {
        id: 13,
        title: "EA Sports FC",
        genre: "Sports",
        platform: "PC, Console",
        description: "Build a team and compete in virtual soccer matches.",
        rating: "Everyone"
    },
    {
        id: 14,
        title: "Madden NFL",
        genre: "Sports",
        platform: "PC, Console",
        description: "Experience American football and manage your team.",
        rating: "Everyone"
    },
    {
        id: 15,
        title: "Tony Hawk's Pro Skater 1 + 2",
        genre: "Sports",
        platform: "PC, Console",
        description: "Perform skating tricks and complete challenging goals.",
        rating: "Teen"
    },

    // SIMULATION GAMES
    {
        id: 16,
        title: "Stardew Valley",
        genre: "Simulation",
        platform: "PC, Console, Mobile",
        description: "Build a farm, meet neighbors, and explore the countryside.",
        rating: "Everyone 10+"
    },
    {
        id: 17,
        title: "The Sims 4",
        genre: "Simulation",
        platform: "PC, Console",
        description: "Create characters, build homes, and manage virtual lives.",
        rating: "Teen"
    },
    {
        id: 18,
        title: "Cities: Skylines",
        genre: "Simulation",
        platform: "PC, Console",
        description: "Design and manage your own growing city.",
        rating: "Everyone"
    },
    {
        id: 19,
        title: "Planet Zoo",
        genre: "Simulation",
        platform: "PC",
        description: "Build a zoo and care for animals from around the world.",
        rating: "Everyone"
    },
    {
        id: 20,
        title: "Microsoft Flight Simulator",
        genre: "Simulation",
        platform: "PC, Xbox",
        description: "Fly aircraft and explore realistic landscapes.",
        rating: "Everyone"
    }
];


/* =======================================================
   PART 3: WEBSITE STATE
   ======================================================= */

// Keep track of the current search and selected genre.
// The favorite IDs are stored separately so favorites can
// remain selected while the user searches or changes genres.

const state = {
    searchText: "",
    selectedGenre: "All",
    favoriteIds: []
};


/* =======================================================
   PART 4: DARK MODE
   ======================================================= */

// Switch between light mode and dark mode when the button
// is clicked. The CSS file controls the actual colors.

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        // Add dark-mode styling if it is absent, or remove it
        // if dark mode is already active.
        const darkModeEnabled = document.body.classList.toggle("dark-mode");

        // Update the button label to describe the available action.
        themeToggle.textContent = darkModeEnabled
            ? "Switch to Light Mode"
            : "Switch to Dark Mode";

        // Update the accessible label for assistive technology.
        themeToggle.setAttribute(
            "aria-pressed",
            String(darkModeEnabled)
        );
    });
}


/* =======================================================
   PART 5: CREATE A GAME CARD
   ======================================================= */

// Build each game card using createElement() and textContent.
// This avoids inserting game information as raw HTML.

function createGameCard(game) {
    // Create the outer card.
    const card = document.createElement("article");
    card.classList.add("game-card");

    // Create and fill the game title.
    const title = document.createElement("h3");
    title.textContent = game.title;

    // Create the genre label.
    const genre = document.createElement("p");
    genre.textContent = "Genre: " + game.genre;

    // Create the platform label.
    const platform = document.createElement("p");
    platform.textContent = "Platform: " + game.platform;

    // Create the game description.
    const description = document.createElement("p");
    description.textContent = game.description;

    // Create the rating label.
    const rating = document.createElement("p");
    rating.textContent = "Rating: " + game.rating;

    // Create a button to add or remove this game from favorites.
    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";

    // Check whether this game is already a favorite.
    const isFavorite = state.favoriteIds.includes(game.id);

    // Show the appropriate button text.
    favoriteButton.textContent = isFavorite
        ? "★ Remove from Favorites"
        : "☆ Add to Favorites";

    // Give the button an accessible label.
    favoriteButton.setAttribute(
        "aria-label",
        (isFavorite ? "Remove " : "Add ") +
        game.title +
        (isFavorite ? " from favorites" : " to favorites")
    );

    // Update favorites when the button is clicked.
    favoriteButton.addEventListener("click", function () {
        toggleFavorite(game.id);
    });

    // Add all elements to the card.
    card.appendChild(title);
    card.appendChild(genre);
    card.appendChild(platform);
    card.appendChild(description);
    card.appendChild(rating);
    card.appendChild(favoriteButton);

    // Return the completed card to the rendering function.
    return card;
}

/* =======================================================
   DYNAMIC GENRE FILTER
   Only display genres that have games in the game library.
   ======================================================= */

function updateGenreFilter() {
    // Remember the genre currently selected by the user.
    const previousGenre = genreFilter.value;

    // Get every unique genre used by a game.
    const availableGenres = [...new Set(
        games.map(function (game) {
            return game.genre;
        })
    )];

    // Sort genre names alphabetically.
    availableGenres.sort();

    // Remove the old options from the dropdown.
    genreFilter.replaceChildren();

    // Add the option that displays every game.
    const allOption = document.createElement("option");
    allOption.value = "All";
    allOption.textContent = "All Genres";
    genreFilter.appendChild(allOption);

    // Add an option only for genres with games.
    availableGenres.forEach(function (genre) {
        const option = document.createElement("option");

        option.value = genre;
        option.textContent = genre;

        genreFilter.appendChild(option);
    });

    // Keep the previous selection if that genre still exists.
    // Otherwise, reset the filter to All Genres.
    if (
        previousGenre === "All" ||
        availableGenres.includes(previousGenre)
    ) {
        genreFilter.value = previousGenre || "All";
    } else {
        genreFilter.value = "All";
    }

    // Synchronize the filtering state with the dropdown.
    state.selectedGenre = genreFilter.value;
}

/* =======================================================
   PART 6: FILTER AND DISPLAY GAMES
   Supports searching, genre filtering, and All Genres.
   ======================================================= */

function renderGames() {
    // Read the search phrase and ignore capitalization.
    const searchText = state.searchText.toLowerCase().trim();

    // Read the selected genre and normalize its value.
    const selectedGenre = String(state.selectedGenre)
        .toLowerCase()
        .trim();

    // Treat these values as requests to display every genre.
    const showAllGenres = [
        "",
        "all",
        "all genres",
        "all-genres"
    ].includes(selectedGenre);

    // Filter the original game array.
    const filteredGames = games.filter(function (game) {
        // Combine searchable information into one string.
        const searchableText = (
            game.title + " " +
            game.genre + " " +
            game.platform + " " +
            game.description
        ).toLowerCase();

        // Check whether the game matches the search phrase.
        const matchesSearch = searchableText.includes(searchText);

        // Compare genre names without capitalization issues.
        const matchesGenre =
            showAllGenres ||
            game.genre.toLowerCase() === selectedGenre;

        // Display the game only if both conditions match.
        return matchesSearch && matchesGenre;
    });

    // Remove cards from the previous search or filter.
    gameList.replaceChildren();

    // Create a card for each matching game.
    filteredGames.forEach(function (game) {
        const card = createGameCard(game);
        gameList.appendChild(card);
    });

    // Display a message when no games match.
    if (filteredGames.length === 0) {
        const message = document.createElement("p");

        message.textContent =
            "No games match your search. Try another title or genre.";

        message.classList.add("no-results");
        gameList.appendChild(message);
    }

    // Update the count so users know how many games are visible.
    resultsCount.textContent =
        "Showing " + filteredGames.length +
        " of " + games.length + " games";
}

/* =======================================================
   PART 7: SEARCH AND GENRE FILTER EVENTS
   ======================================================= */

// Update the search state whenever the user types.
if (gameSearch) {
    gameSearch.addEventListener("input", function () {
        state.searchText = gameSearch.value;
        renderGames();
    });
}

// Update the selected genre whenever the dropdown changes.
if (genreFilter) {
    genreFilter.addEventListener("change", function () {
        state.selectedGenre = genreFilter.value;
        renderGames();
    });
}


/* =======================================================
   PART 8: FAVORITES
   ======================================================= */

// Add a game to favorites or remove it if it is already saved.

function toggleFavorite(gameId) {
    // Find the game's current position in the favorites list.
    const favoriteIndex = state.favoriteIds.indexOf(gameId);

    if (favoriteIndex === -1) {
        // The game is not a favorite, so add it.
        state.favoriteIds.push(gameId);
    } else {
        // The game is already a favorite, so remove it.
        state.favoriteIds.splice(favoriteIndex, 1);
    }

    // Refresh the main list so the button label changes.
    renderGames();

    // Refresh the favorites section.
    renderFavorites();
}


// Display all games that have been added to favorites.

function renderFavorites() {
    // Stop if this page does not contain the favorites section.
    if (!favoritesList) {
        return;
    }

    // Remove the old favorites before rebuilding the section.
    favoritesList.replaceChildren();

    // Find the game objects corresponding to favorite IDs.
    const favoriteGames = games.filter(function (game) {
        return state.favoriteIds.includes(game.id);
    });

    // Display a message when there are no favorites.
    if (favoriteGames.length === 0) {
        const message = document.createElement("p");
        message.textContent =
            "You have not added any favorite games yet.";

        favoritesList.appendChild(message);
        return;
    }

    // Display each favorite using the same card function.
    favoriteGames.forEach(function (game) {
        favoritesList.appendChild(createGameCard(game));
    });
}


/* =======================================================
   PART 9: GAME SUGGESTION FORM
   This section validates the form and displays a summary.
   The IDs below match the provided HTML.
   ======================================================= */

// Run this code when the visitor submits the form.
if (suggestionForm) {
    suggestionForm.addEventListener("submit", function (event) {

        // Prevent the browser from refreshing the page.
        event.preventDefault();

        // Clear any previous error and success messages.
        formError.textContent = "";
        formSummary.textContent = "";
        formSummary.hidden = true;

        // Find the three input fields using their actual HTML IDs.
        const visitorName = document.getElementById("visitor-name");
        const suggestedGame = document.getElementById("suggested-game");
        const suggestedGenre = document.getElementById("suggested-genre");

        // Read the values and remove unnecessary spaces.
        const name = visitorName.value.trim();
        const game = suggestedGame.value.trim();
        const genre = suggestedGenre.value.trim();

        // Check that all fields have been filled out.
        if (name === "" || game === "" || genre === "") {
            formError.textContent =
                "Please complete all required fields before submitting.";
            return;
        }

        // Make sure the display name contains at least two characters.
        if (name.length < 2) {
            formError.textContent =
                "Your display name must contain at least 2 characters.";
            visitorName.focus();
            return;
        }

        // Make sure the game title contains at least two characters.
        if (game.length < 2) {
            formError.textContent =
                "The game title must contain at least 2 characters.";
            suggestedGame.focus();
            return;
        }

        // Display a summary of the submitted suggestion.
        formSummary.textContent =
            "Thank you, " + name + "! Your suggestion for \"" +
            game + "\" in the " + genre +
            " genre has been received.";

        // Make the previously hidden success message visible.
        formSummary.hidden = false;

        // Clear the form after successful submission.
        suggestionForm.reset();

        // Put the keyboard focus on the success message's container.
        formSummary.setAttribute("tabindex", "-1");
        formSummary.focus();
    });
}

/* =======================================================
   PART 10: LIVE CHARACTER COUNT
   ======================================================= */

// If the HTML includes a character counter, update it as
// the user types in the game suggestion name field.

function updateCharacterCount() {
    // Do nothing if either element is missing.
    if (!suggestionName || !characterCount) {
        return;
    }

    // Display the number of characters currently entered.
    characterCount.textContent =
        suggestionName.value.length + " characters";
}

// Listen for changes to the suggestion title.
if (suggestionName) {
    suggestionName.addEventListener("input", updateCharacterCount);
}


/* =======================================================
   INITIALIZE THE WEBSITE
   ======================================================= */

// Build the genre dropdown using the available games.
updateGenreFilter();

// Display the complete game library.
renderGames();

// Display the initial favorites section.
renderFavorites();

// Initialize the suggestion form character counter.
updateCharacterCount();
