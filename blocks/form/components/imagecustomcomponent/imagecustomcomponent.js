/**
 * Custom imagecustomcomponent component
 * Based on: Image
 */

/**
 * Decorates a custom form field component
 * @param {HTMLElement} fieldDiv - The field wrapper element. See the docs for its
 *   structure for each component.
 * @param {Object} fieldJson - The form json object for the component.
 * @param {HTMLElement} parentElement - The parent element of the field.
 * @param {string} formId - The unique identifier of the form.
 */
export default async function decorate(fieldDiv, fieldJson, parentElement, formId) {
  // eslint-disable-next-line no-console
  console.log('⚙️ Decorating imagecustomcomponent component:', fieldDiv, fieldJson, parentElement, formId);

  // TODO: Implement your custom component logic here
  // You can access the field properties via fieldJson.properties

  return fieldDiv;
}
