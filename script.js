
// =====================================
// PALETTEPOP - COLOR PALETTE GENERATOR
// =====================================

// DOM ELEMENTS
const paletteGrid = document.getElementById("paletteGrid");
const generateBtn = document.getElementById("generateBtn");
const saveBtn = document.getElementById("saveBtn");
const favoritesContainer = document.getElementById("favoritesContainer");
const clearFavorites = document.getElementById("clearFavorites");

// APPLICATION STATE
let colors = [];
let lockedColors = [false, false, false, false, false];

let favorites = JSON.parse(
    localStorage.getItem("paletteFavorites")
) || [];


// =====================================
// 1. GENERATE RANDOM HEX COLOR
// =====================================

function generateRandomColor() {

    const characters = "0123456789ABCDEF";
    let hex = "#";

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(
            Math.random() * 16
        );

        hex += characters[randomIndex];
    }

    return hex;
}


// =====================================
// 2. GENERATE PALETTE
// =====================================

function generatePalette() {

    colors = colors.map((color, index) => {

        if (lockedColors[index]) {
            return color;
        }

        return generateRandomColor();

    });

    renderPalette();
}


// =====================================
// 3. DISPLAY COLOR CARDS
// =====================================

function renderPalette() {

    paletteGrid.innerHTML = "";

    colors.forEach((color, index) => {

        const card = document.createElement("div");
        card.className = "color-card";

        card.innerHTML = `
            <div class="color-preview"
                 style="background-color: ${color}"
                 data-copy="${color}">

                <span class="copy-hint">Click to copy</span>

            </div>

            <div class="color-info">

                <span class="hex-code">${color}</span>

                <button
                    class="lock-btn ${lockedColors[index] ? "locked" : ""}"
                    data-lock="${index}"
                    aria-label="Toggle color lock">
                    ${lockedColors[index] ? "🔒" : "🔓"}
                </button>

            </div>
        `;

        paletteGrid.appendChild(card);

    });

}


// =====================================
// 4. COPY HEX CODE
// =====================================

async function copyColor(color) {

    try {

        await navigator.clipboard.writeText(color);

        showToast(`${color} copied!`);

    } catch (error) {

        showToast("Unable to copy. Try localhost or HTTPS.");

    }

}


// =====================================
// 5. LOCK / UNLOCK COLORS
// =====================================

function toggleLock(index) {

    lockedColors[index] = !lockedColors[index];

    renderPalette();

}


// =====================================
// 6. SAVE FAVORITE PALETTE
// =====================================

function savePalette() {

    const palette = [...colors];

    const exists = favorites.some(
        favorite => JSON.stringify(favorite) === JSON.stringify(palette)
    );

    if (exists) {
        showToast("Palette already saved!");
        return;
    }

    favorites.push(palette);

    localStorage.setItem(
        "paletteFavorites",
        JSON.stringify(favorites)
    );

    renderFavorites();

    showToast("Palette saved successfully!");

}


// =====================================
// 7. DISPLAY FAVORITES
// =====================================

function renderFavorites() {

    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {

        favoritesContainer.innerHTML = `
            <p class="empty-message">
                No saved palettes yet. Find a combination you love!
            </p>
        `;

        return;
    }

    favorites.forEach((palette, index) => {

        const item = document.createElement("div");
        item.className = "favorite-item";

        const colorDisplay = palette.map(color => `
            <div class="favorite-color"
                 style="background-color: ${color}">
            </div>
        `).join("");

        item.innerHTML = `

            <div class="favorite-colors">
                ${colorDisplay}
            </div>

            <span class="favorite-label">
                Palette ${index + 1}
            </span>

            <div class="favorite-actions">

                <button data-apply="${index}">
                    Apply
                </button>

                <button data-delete="${index}">
                    Delete
                </button>

            </div>
        `;

        favoritesContainer.appendChild(item);

    });

}


// =====================================
// 8. APPLY SAVED PALETTE
// =====================================

function applyPalette(index) {

    colors = [...favorites[index]];

    lockedColors = [false, false, false, false, false];

    renderPalette();

    showToast("Palette applied!");

}


// =====================================
// 9. DELETE FAVORITE
// =====================================

function deleteFavorite(index) {

    favorites.splice(index, 1);

    localStorage.setItem(
        "paletteFavorites",
        JSON.stringify(favorites)
    );

    renderFavorites();

}


// =====================================
// 10. CLEAR ALL FAVORITES
// =====================================

function deleteAllFavorites() {

    favorites = [];

    localStorage.removeItem("paletteFavorites");

    renderFavorites();

    showToast("All favorites cleared!");

}


// =====================================
// 11. TOAST NOTIFICATION
// =====================================

function showToast(message) {

    const oldToast = document.querySelector(".toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000);

}


// =====================================
// 12. EVENT LISTENERS
// =====================================

// Generate new palette
generateBtn.addEventListener("click", generatePalette);

// Save current palette
saveBtn.addEventListener("click", savePalette);

// Copy color and toggle lock
paletteGrid.addEventListener("click", event => {

    const copyElement = event.target.closest("[data-copy]");
    const lockElement = event.target.closest("[data-lock]");

    if (copyElement) {
        copyColor(copyElement.dataset.copy);
    }

    if (lockElement) {
        toggleLock(Number(lockElement.dataset.lock));
    }

});

// Favorite actions
favoritesContainer.addEventListener("click", event => {

    const applyElement = event.target.closest("[data-apply]");
    const deleteElement = event.target.closest("[data-delete]");

    if (applyElement) {
        applyPalette(Number(applyElement.dataset.apply));
    }

    if (deleteElement) {
        deleteFavorite(Number(deleteElement.dataset.delete));
    }

});

// Clear favorites
clearFavorites.addEventListener("click", deleteAllFavorites);

// Spacebar generates palette
document.addEventListener("keydown", event => {

    if (
        event.code === "Space" &&
        !["INPUT", "TEXTAREA", "BUTTON"].includes(
            document.activeElement.tagName
        )
    ) {

        event.preventDefault();
        generatePalette();

    }

});


// =====================================
// 13. INITIALIZE APPLICATION
// =====================================

colors = Array.from(
    { length: 5 },
    () => generateRandomColor()
);

renderPalette();
renderFavorites();



// =====================================
// 14. DARK MODE
// =====================================

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

// Apply selected theme
function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark-mode");

        themeIcon.textContent = "☀️";
        themeText.textContent = "Light Mode";

    } else {

        document.body.classList.remove("dark-mode");

        themeIcon.textContent = "🌙";
        themeText.textContent = "Dark Mode";

    }

}

// Load saved theme
const savedTheme = localStorage.getItem("paletteTheme") || "light";

applyTheme(savedTheme);

// Toggle theme
themeToggle.addEventListener("click", () => {

    const isDark = document.body.classList.contains("dark-mode");

    const newTheme = isDark ? "light" : "dark";

    localStorage.setItem("paletteTheme", newTheme);

    applyTheme(newTheme);

});

