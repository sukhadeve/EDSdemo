/**
 * Custom imagecustomcomponent component
 * Based on: Image
 *
 * Renders multiple images. The images are authored via the custom multi-value
 * "images" property (an asset reference picker with multi: true). Because
 * "images" is not a reserved property, the AEM Forms server model exposes it in
 * the runtime form JSON under `fieldJson.properties.images` as a String array.
 */

import { createOptimizedPicture } from '../../../../scripts/aem.js';

/**
 * Collects the list of image paths from the field JSON, tolerating the
 * different shapes the value can take across authoring sources
 * (array, comma separated string, or the single-image fallbacks).
 * @param {Object} fieldJson - The form json object for the component.
 * @returns {string[]} de-duplicated list of image paths
 */
function getImageSources(fieldJson) {
  const props = fieldJson?.properties || {};
  let list = props.images ?? fieldJson?.value ?? props['fd:repoPath'] ?? [];
  if (!Array.isArray(list)) {
    list = String(list).split(',');
  }
  return [...new Set(list.map((s) => String(s).trim()).filter(Boolean))];
}

/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The field wrapper element.
 * @param {Object} fieldJson - The form json object for the component.
 * @param {HTMLElement} parentElement - The parent element of the field.
 * @param {string} formId - The unique identifier of the form.
 */
export default async function decorate(fieldDiv, fieldJson) {
  const altText = fieldJson?.altText || fieldJson?.name || '';
  const sources = getImageSources(fieldJson);

  // Remove the single image the core image renderer already added.
  fieldDiv.querySelectorAll('picture, img').forEach((el) => el.remove());

  const gallery = document.createElement('div');
  gallery.className = 'image-group';

  sources.forEach((src) => {
    const item = document.createElement('div');
    item.className = 'image-group-item';
    item.append(createOptimizedPicture(src, altText, false));
    gallery.append(item);
  });

  fieldDiv.append(gallery);

  // Keep the help/description text (if any) below the gallery.
  const helpText = fieldDiv.querySelector('.field-description');
  if (helpText) {
    fieldDiv.append(helpText);
  }

  return fieldDiv;
}
