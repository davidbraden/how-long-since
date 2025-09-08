import {
    getState,
    addCategory,
    updateCategory,
    deleteCategory,
    setActiveCategory,
} from './data.js';
import { cloneTemplate } from './utils.js';

let renderCallback = () => {};

function renderTabs() {
    const { categories, activeCategoryId } = getState();
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = '';

    categories.forEach(cat => {
        const tab = cloneTemplate('tab-template').firstElementChild;
        tab.classList.toggle('active', cat.id === activeCategoryId);
        tab.dataset.categoryId = cat.id;

        const tabName = tab.querySelector('.tab-name');
        tabName.textContent = cat.name;
        tabName.dataset.categoryId = cat.id;

        tab.querySelector('.delete-tab-btn').dataset.categoryId = cat.id;

        tabsContainer.appendChild(tab);
    });

    const addTabBtn = document.createElement('button');
    addTabBtn.id = 'add-tab-btn';
    addTabBtn.textContent = '+';
    tabsContainer.appendChild(addTabBtn);
}

function setupTabEventListeners() {
    const tabsContainer = document.getElementById('tabs');
    let pressTimer = null;
    let isEditing = false;

    const handlePressStart = (e) => {
        if (e.target.matches('.tab-name')) {
            isEditing = false; // Reset on new press
            pressTimer = setTimeout(() => {
                isEditing = true;
                activateTabEdit(e.target);
            }, 500); // 500ms for long press
        }
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
    };

    // Mouse events for long press
    tabsContainer.addEventListener('mousedown', handlePressStart);
    tabsContainer.addEventListener('mouseup', cancelPress);
    tabsContainer.addEventListener('mouseleave', cancelPress);

    // Touch events for long press
    tabsContainer.addEventListener('touchstart', handlePressStart);
    tabsContainer.addEventListener('touchend', cancelPress);
    tabsContainer.addEventListener('touchmove', cancelPress); // Cancel if user starts scrolling

    // Prevent context menu on long press
    tabsContainer.addEventListener('contextmenu', e => {
        if (e.target.matches('.tab-name-edit')) {
            e.preventDefault();
        }
    });

    tabsContainer.addEventListener('click', e => {
        if (e.target.matches('#add-tab-btn')) {
            const newCategory = addCategory('New Category');
            renderCallback();
            const newTabSpan = tabsContainer.querySelector(`.tab-name[data-category-id="${newCategory.id}"]`);
            if (newTabSpan) {
                activateTabEdit(newTabSpan);
            }
        } else if (e.target.matches('.delete-tab-btn')) {
            const categoryId = e.target.dataset.categoryId;
            if (confirm('Are you sure you want to delete this category and all its items?')) {
                deleteCategory(categoryId);
                renderCallback();
            }
        } else {
            const tab = e.target.closest('.tab');
            // Only set active category on click if we are not in the process of editing
            if (tab && !isEditing) {
                setActiveCategory(tab.dataset.categoryId);
                renderCallback();
            }
        }
    });
}

function activateTabEdit(tabNameSpan) {
    const categoryId = tabNameSpan.dataset.categoryId;
    const originalName = tabNameSpan.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalName;
    input.className = 'tab-name-edit';

    tabNameSpan.replaceWith(input);
    input.focus();
    input.select();

    const save = () => {
        const newName = input.value.trim();
        if (newName && newName !== originalName) {
            updateCategory(categoryId, newName);
        }
        // Re-render to restore the span
        renderCallback();
    };

    input.addEventListener('blur', save);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            save();
        } else if (e.key === 'Escape') {
            // Re-render to cancel
            renderCallback();
        }
    });
}

export function initTabs(render) {
    renderCallback = render;
    setupTabEventListeners();
}

export { renderTabs };
