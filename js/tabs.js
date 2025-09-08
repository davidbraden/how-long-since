import {
    getState,
    addCategory,
    updateCategory,
    deleteCategory,
    setActiveCategory,
} from './data.js';

let renderCallback = () => {};

function renderTabs() {
    const { categories, activeCategoryId } = getState();
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = '';
    categories.forEach(cat => {
        const tab = document.createElement('div');
        tab.className = `tab ${cat.id === activeCategoryId ? 'active' : ''}`;
        tab.dataset.categoryId = cat.id;

        const tabName = document.createElement('span');
        tabName.textContent = cat.name;
        tabName.className = 'tab-name';
        tabName.dataset.categoryId = cat.id;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.className = 'delete-tab-btn';
        deleteBtn.dataset.categoryId = cat.id;

        tab.appendChild(tabName);
        tab.appendChild(deleteBtn);
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

    tabsContainer.addEventListener('mousedown', e => {
        if (e.target.matches('.tab-name')) {
            pressTimer = setTimeout(() => {
                activateTabEdit(e.target);
            }, 500); // 500ms for long press
        }
    });

    tabsContainer.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
    });

    tabsContainer.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
    });

    tabsContainer.addEventListener('click', e => {
        if (e.target.matches('#add-tab-btn')) {
            const newName = prompt('Enter new category name:');
            if (newName && newName.trim()) {
                addCategory(newName.trim());
                renderCallback();
            }
        } else if (e.target.matches('.delete-tab-btn')) {
            const categoryId = e.target.dataset.categoryId;
            if (confirm('Are you sure you want to delete this category and all its items?')) {
                deleteCategory(categoryId);
                renderCallback();
            }
        } else {
            const tab = e.target.closest('.tab');
            if (tab && !tab.querySelector('input')) {
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
