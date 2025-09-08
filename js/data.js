// --- STATE MANAGEMENT ---
const AppState = {
    categories: [],
    activeCategoryId: null
};

// --- DATA ACCESS FUNCTIONS ---

export function loadState() {
    const storedState = localStorage.getItem('howLongSinceState');
    if (storedState) {
        Object.assign(AppState, JSON.parse(storedState));
        // If there are categories but none is active, activate the first one.
        if (AppState.categories.length > 0 && !AppState.activeCategoryId) {
            AppState.activeCategoryId = AppState.categories[0].id;
        }
    }
}

export function saveState() {
    localStorage.setItem('howLongSinceState', JSON.stringify(AppState));
}

export function getState() {
    return AppState;
}

export function setActiveCategory(categoryId) {
    AppState.activeCategoryId = categoryId;
    saveState();
}

export function getActiveCategory() {
    return AppState.categories.find(c => c.id === AppState.activeCategoryId);
}

export function addItem(itemData) {
    const activeCategory = getActiveCategory();
    if (activeCategory) {
        activeCategory.items.push({ id: `item-${Date.now()}`, ...itemData });
        saveState();
    }
}

export function updateItem(itemId, itemData) {
    const activeCategory = getActiveCategory();
    if (activeCategory) {
        const itemIndex = activeCategory.items.findIndex(i => i.id === itemId);
        if (itemIndex > -1) {
            activeCategory.items[itemIndex] = { ...activeCategory.items[itemIndex], ...itemData };
            saveState();
        }
    }
}

export function deleteItem(itemId) {
    const activeCategory = getActiveCategory();
    if (activeCategory) {
        activeCategory.items = activeCategory.items.filter(i => i.id !== itemId);
        saveState();
    }
}

export function addCategory(name) {
    const newCategory = {
        id: `cat-${Date.now()}`,
        name: name,
        items: []
    };
    AppState.categories.push(newCategory);
    // If it's the first category, make it active
    if (AppState.categories.length === 1) {
        AppState.activeCategoryId = newCategory.id;
    }
    saveState();
}

export function updateCategory(id, newName) {
    const category = AppState.categories.find(c => c.id === id);
    if (category) {
        category.name = newName;
        saveState();
    }
}

export function deleteCategory(id) {
    AppState.categories = AppState.categories.filter(c => c.id !== id);
    // If the deleted category was the active one, switch to the first available, or null
    if (AppState.activeCategoryId === id) {
        AppState.activeCategoryId = AppState.categories.length > 0 ? AppState.categories[0].id : null;
    }
    saveState();
}



// --- UTILITY FUNCTIONS ---

export function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function calculateDifference(lastSeen, targetWeeks) {
    const lastDate = new Date(lastSeen);
    const today = new Date();
    const diffMillis = today - lastDate;
    const diffWeeks = Math.floor(diffMillis / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks - targetWeeks;
}
