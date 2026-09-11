/**
 * Custom imagecustomcomponent component
 * Based on: Image
 *
 * Renders multiple images. The images are authored via the custom multi-value
 * "images" property (an asset reference picker with multi: true). Because
 * "images" is not a reserved property, the AEM Forms server model exposes it in
 * the runtime form JSON under `fieldJson.properties.images`.
 *
 * The exact serialized shape can vary by authoring source (array of strings,
 * array of objects, comma separated string, ...), so the extraction below is
 * deliberately defensive and also scans every property for asset-like paths.
 */

import { createOptimizedPicture } from '../../../../scripts/aem.js';

const IMAGE_EXT = /\.(jpe?g|png|gif|svg|webp|bmp|avif|tiff?)($|\?|#)/i;

/**
 * Turns a single candidate (string or object) into an image path, or null.
 */
function toPath(entry) {
  if (!entry) return null;
  if (typeof entry === 'string') return entry.trim();
  if (typeof entry === 'object') {
    const v = entry.path || entry.value || entry['fd:repoPath'] || entry.src || entry.reference;
    return typeof v === 'string' ? v.trim() : null;
  }
  return null;
}

/**
 * Normalises any candidate value (array / CSV string / single) to a path list.
 */
function toList(value) {
  if (Array.isArray(value)) return value.map(toPath).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  const single = toPath(value);
  return single ? [single] : [];
}

/**
 * Collects the list of image paths from the field JSON.
 * @param {Object} fieldJson - The form json object for the component.
 * @returns {string[]} de-duplicated list of image paths
 */
function getImageSources(fieldJson) {
  const props = fieldJson?.properties || {};

  // 1) Preferred: the custom multi property, then the single-image fallbacks.
  let sources = [
    ...toList(props.images),
    ...toList(fieldJson?.value),
    ...toList(props['fd:repoPath']),
    ...toList(props.fileReference),
  ];

  // 2) Fallback: scan every property for arrays / strings that look like images.
  if (sources.length <= 1) {
    Object.values(props).forEach((val) => {
      toList(val).forEach((p) => {
        if (p.startsWith('/content/dam') || IMAGE_EXT.test(p)) sources.push(p);
      });
    });
  }

  return [...new Set(sources.filter(Boolean))];
}

/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The field wrapper element.
 * @param {Object} fieldJson - The form json object for the component.
 */
export default async function decorate(fieldDiv, fieldJson) {
  // Temporary diagnostic — inspect the real runtime shape in the browser console.
  // Remove once confirmed working.
  // eslint-disable-next-line no-console
  console.log('🖼️ imagecustomcomponent properties:', fieldJson?.properties, 'value:', fieldJson?.value);

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
