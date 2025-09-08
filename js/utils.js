/**
 * Clones a template element by its ID.
 * @param {string} id The ID of the template element.
 * @returns {DocumentFragment | null} The cloned document fragment, or null if the template is not found.
 */
export function cloneTemplate(id) {
    const template = document.getElementById(id);
    if (template) {
        return template.content.cloneNode(true);
    }
    console.error(`Template with id "${id}" not found.`);
    return null;
}
