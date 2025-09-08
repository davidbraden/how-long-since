import { loadState } from './data.js';
import { initTabs, renderTabs } from './tabs.js';
import { initItems, renderItemsAndButton } from './items.js';

document.addEventListener('DOMContentLoaded', () => {
    function render() {
        renderTabs();
        renderItemsAndButton();
    }

    // --- INITIALIZATION ---
    loadState();
    initTabs(render);
    initItems(render);
    render();
});
