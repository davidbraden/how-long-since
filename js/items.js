import {
    getState,
    getActiveCategory,
    addItem,
    updateItem,
    deleteItem,
    getTodayDateString,
    calculateDifference
} from './data.js';
import { cloneTemplate } from './utils.js';

let renderCallback = () => {};

// --- DOM ELEMENTS ---
const itemListContainer = document.getElementById('item-list');
const modal = document.getElementById('edit-modal');
const modalTitle = document.getElementById('modal-title');
const form = document.getElementById('edit-form');
const itemIdInput = document.getElementById('item-id');
const itemNameInput = document.getElementById('item-name');
const lastSeenInput = document.getElementById('last-seen');
const targetWeeksInput = document.getElementById('target-weeks');

function renderItems() {
    itemListContainer.innerHTML = '';
    const activeCategory = getActiveCategory();
    if (!activeCategory) {
        itemListContainer.appendChild(cloneTemplate('no-category-message-template'));
        return;
    }

    if (activeCategory.items.length === 0) {
        itemListContainer.appendChild(cloneTemplate('no-items-message-template'));
        return;
    }

    activeCategory.items.forEach(item => {
        const diff = calculateDifference(item.lastSeen, item.target);
        let diffClass = 'diff-ahead';
        if (diff === 0) diffClass = 'diff-due';
        if (diff > 0) diffClass = 'diff-overdue';

        const card = cloneTemplate('item-card-template').firstElementChild;
        card.dataset.itemId = item.id;
        card.querySelector('.item-name').textContent = item.name;
        const diffSpan = card.querySelector('.item-diff');
        diffSpan.textContent = diff;
        diffSpan.className = `item-diff ${diffClass}`;

        itemListContainer.appendChild(card);
    });
}

function openModal(itemId = null) {
    const activeCategory = getActiveCategory();
    if (!activeCategory) {
        alert("Please add and select a category first!");
        return;
    }

    form.reset();
    const item = itemId ? activeCategory.items.find(i => i.id === itemId) : null;

    if (item) {
        modalTitle.textContent = 'Edit Item';
        itemIdInput.value = item.id;
        itemNameInput.value = item.name;
        lastSeenInput.value = item.lastSeen;
        targetWeeksInput.value = item.target;
        document.getElementById('delete-btn').style.display = 'block';
    } else {
        modalTitle.textContent = 'Add New Item';
        itemIdInput.value = '';
        lastSeenInput.value = getTodayDateString();
        document.getElementById('delete-btn').style.display = 'none';
    }
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

function setupItemEventListeners() {
    itemListContainer.addEventListener('click', e => {
        const card = e.target.closest('.item-card');
        if (card) {
            openModal(card.dataset.itemId);
        }
    });

    document.getElementById('add-item-btn').addEventListener('click', () => openModal());
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            closeModal();
        }
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const id = itemIdInput.value;
        const itemData = {
            name: itemNameInput.value,
            lastSeen: lastSeenInput.value,
            target: parseInt(targetWeeksInput.value, 10)
        };

        if (id) {
            updateItem(id, itemData);
        } else {
            addItem(itemData);
        }
        
        renderCallback();
        closeModal();
    });

    document.getElementById('update-now-btn').addEventListener('click', () => {
        lastSeenInput.value = getTodayDateString();
        form.requestSubmit();
    });

    document.getElementById('delete-btn').addEventListener('click', () => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        
        deleteItem(itemIdInput.value);
        renderCallback();
        closeModal();
    });
}


export function initItems(render) {
    renderCallback = render;
    const addItemBtn = document.getElementById('add-item-btn');
    
    // Initial check
    const { categories } = getState();
    addItemBtn.style.display = categories.length > 0 ? 'flex' : 'none';

    setupItemEventListeners();
}

export function renderItemsAndButton() {
    const { categories } = getState();
    const addItemBtn = document.getElementById('add-item-btn');
    addItemBtn.style.display = categories.length > 0 ? 'flex' : 'none';
    renderItems();
}
