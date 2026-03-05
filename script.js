const recipeGrid = document.getElementById("recipeGrid");
const categoryTabs = document.querySelectorAll(".cat-tab");
const searchInput = document.getElementById("searchInput");

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const ingredientList = document.getElementById("ingredientList");
const modalInstructions = document.getElementById("modalInstructions");
const searchBtn = document.getElementById("searchBtn");

// Load default
window.addEventListener("DOMContentLoaded", () => {
  fetchRecipesByCategory("Seafood");
});

// Fetch by Category
async function fetchRecipesByCategory(category) {
  recipeGrid.innerHTML = `<div class="loading">Loading recipes...</div>`;

  let url;

  if (category === "All") {
    url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  } else {
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  displayRecipes(data.meals);
}

// Display Recipes
function displayRecipes(meals) {
  recipeGrid.innerHTML = "";

  if (!meals) {
    recipeGrid.innerHTML = `<div class="no-results">No recipes found.</div>`;
    return;
  }

  meals.slice(0, 12).forEach(meal => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
      <div class="card-image">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      </div>
      <div class="card-body">
        <h3 class="card-title">${meal.strMeal}</h3>
      </div>
    `;

    // 🔥 CLICK EVENT ADDED
    card.addEventListener("click", () => {
      fetchRecipeDetails(meal.idMeal);
    });

    recipeGrid.appendChild(card);
  });
}

// Fetch Full Details
async function fetchRecipeDetails(id) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  const meal = data.meals[0];

  openModal(meal);
}

// Open Modal
function openModal(meal) {
  modalImage.src = meal.strMealThumb;
  modalTitle.textContent = meal.strMeal;
  modalInstructions.textContent = meal.strInstructions;

  ingredientList.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      const li = document.createElement("li");
      li.innerHTML = `
        ${ingredient}
        <span class="ingredient-amount">${measure}</span>
      `;
      ingredientList.appendChild(li);
    }
  }

  modalOverlay.classList.add("open");
}

// Close Modal
modalClose.addEventListener("click", () => {
  modalOverlay.classList.remove("open");
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("open");
  }
});

// Category Click
categoryTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".cat-tab.active").classList.remove("active");
    tab.classList.add("active");

    fetchRecipesByCategory(tab.dataset.category);
  });
});

// Search
// Common Search Function
async function searchRecipes() {
  const query = searchInput.value.trim();
  if (!query) return;

  recipeGrid.innerHTML = `<div class="loading">Searching...</div>`;

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();

    displayRecipes(data.meals);
  } catch (error) {
    recipeGrid.innerHTML = `<div class="no-results">Something went wrong.</div>`;
  }
}

// Search on Enter
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    searchRecipes();
  }
});

// Search on Button Click
searchBtn.addEventListener("click", () => {
  searchRecipes();
});