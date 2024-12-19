    const homeLink = document.getElementById("home");
    const searchLink = document.getElementById("search-link");
    const mainContent = document.getElementById("main-content");

    
    function renderHome() {
        mainContent.innerHTML = `
            <h1>Random Cocktail</h1>
            <div id="cocktail">
                <p>Loading..</p>
            </div>
            <div class="button-container">
                <button id="new-cocktail">Get New Cocktail</button>
                <button id="see-more" data-id="" disabled>See More</button>
            </div>
        `;
        fetchRandomCocktail();

        const newCocktailButton = document.getElementById("new-cocktail");
        newCocktailButton.addEventListener("click", fetchRandomCocktail);
    }


    async function fetchRandomCocktail() {
        const cocktailDiv = document.getElementById("cocktail");
        const seeMoreButton = document.getElementById("see-more");

        try {
            const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
            const data = await response.json();
            const drink = data.drinks[0];
    
            cocktailDiv.innerHTML = `
                <h2>${drink.strDrink}</h2>
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="300">
            `;
    
            seeMoreButton.dataset.id = drink.idDrink;
            seeMoreButton.disabled = false;
            setupDetailLink();
        } catch {
            cocktailDiv.innerHTML = `<p>Failed to load cocktail. Please try again.</p>`;
            seeMoreButton.disabled = true;
        }
    }


    function setupDetailLink() {
        const seeMoreButton = document.getElementById("see-more");
    
        seeMoreButton.onclick = null; 

        seeMoreButton.addEventListener("click", async () => {
            const recipeId = seeMoreButton.dataset.id;
            fetchCocktailDetails(recipeId); 
        });
    }
    

    function fetchCocktailDetails(recipeId, button) {

        if (button) {
            button.disabled = true;
            button.textContent = "Loading...";
        }
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
            .then(response => response.json())
            .then(data => {
                const drink = data.drinks[0];
                const ingredients = [];
    
                for (let i = 1; i <= 15; i++) {
                    const ingredient = drink[`strIngredient${i}`];
                    const measure = drink[`strMeasure${i}`];
                    if (ingredient) {
                        ingredients.push(`${ingredient} - ${measure || "As needed"}`);
                    }
                }
    
                const instructionSteps = drink.strInstructions
                    .split(/(?<=[.!?])\s+(?=[A-Z])/)
                    .map(step => step.trim())
                    .filter(step => step);
    
                const tags = drink.strTags ? drink.strTags.split(",") : [];
                const tagsSection = tags.length > 0 ? `<ul class="tags-horizontal">${tags.map(tag => `<li>${tag.trim()}</li>`).join("")}</ul>` : '';
    
                mainContent.innerHTML = `
                    <p><strong>${drink.strCategory}</strong></p>
                    <h1>${drink.strDrink}</h1>
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="300">
                    ${tagsSection}
                    <h2>Ingredients</h2>
                    <ol class="ingredients">
                        ${ingredients.map(item => `<li>${item}</li>`).join("")}
                    </ol>
                    <h2>Instructions</h2>
                    <ol class="instructions">
                        <li><strong>Served with:</strong> ${drink.strGlass}</li>
                        ${instructionSteps.map(step => `<li>${step}</li>`).join("")}
                    </ol>
                `;
            })
            .catch(() => {
                mainContent.innerHTML = `<p>Failed to load cocktail details. Please try again.</p>`;
            })
            .then(() => {
                if (button) {
                    button.disabled = false;
                    button.textContent = "See More";
                }
            });
    }
    
    
    function renderSearchPage() {
        mainContent.innerHTML = `
            <h1>Search for Cocktails</h1>
            <form id="search-form">
                <input type="text" id="search-input" placeholder="Search by cocktail name" required>
                <button type="submit">Search</button>
            </form>
            <div id="search-results"></div>
        `;
        setupSearchForm();
    }

    function setupSearchForm() {
        const searchForm = document.getElementById("search-form");

        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const searchInput = document.getElementById("search-input").value.trim();
            if (searchInput) {
                fetchSearchResults(searchInput);
            }
        });
    }

    async function fetchSearchResults(query) {
        const resultsDiv = document.getElementById("search-results");
        resultsDiv.innerHTML = `<p>Searching for "${query}"...</p>`;
        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
    
            if (data.drinks) {
                const cocktails = data.drinks.map(drink => ({
                    id: drink.idDrink,
                    name: drink.strDrink,
                    thumbnail: drink.strDrinkThumb,
                }));
    
                resultsDiv.innerHTML = `
                    <ul>
                        ${cocktails.map(cocktail => `
                            <li>
                                <h3>${cocktail.name}</h3>
                                <img src="${cocktail.thumbnail}" alt="${cocktail.name}">
                                <button class="see-more" data-id="${cocktail.id}">See more</button>
                            </li>
                        `).join("")}
                    </ul>
                `;
    
                setupDetailLinkForSearchResults();
            } else {

                resultsDiv.innerHTML = `<p>No cocktails found for "${query}".</p>`;
            }
        } catch (error) {

            resultsDiv.innerHTML = `<p>Failed to fetch search results. Please try again.</p>`;
        }
    }
    
    function setupDetailLinkForSearchResults() {
        const resultsDiv = document.getElementById("search-results");
    
        resultsDiv.addEventListener("click", (e) => {
            const button = e.target.closest(".see-more"); 
            if (button) {
                const recipeId = button.getAttribute("data-id");
                console.log(`Fetching details for recipe ID: ${recipeId}`);
                fetchCocktailDetails(recipeId, button);
            }
        });
    }

    renderHome();
    searchLink.addEventListener("click", renderSearchPage);
    homeLink.addEventListener("click", renderHome);
