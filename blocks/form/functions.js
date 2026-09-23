/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculate a person's age in completed years from their date of birth.
 * @name calculateAge Age in years from date of birth
 * @param {string} dateOfBirth The date of birth (ISO string, e.g. yyyy-mm-dd).
 * @return {number} The age in completed years, or 0 for an invalid date.
 */
function calculateAge(dateOfBirth) {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;

  // return zero if the date is invalid
  if (!dob || Number.isNaN(dob.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  // subtract a year if the birthday has not occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age < 0 ? 0 : age;
}

/**
 * Convert a string to Title Case (first letter of each word capitalised).
 * @name toTitleCase Convert text to Title Case
 * @param {string} text The input text.
 * @return {string} The Title Cased text, or an empty string for invalid input.
 */
function toTitleCase(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return '';
  }

  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Apply a percentage discount to a price and return the payable amount.
 * @name applyDiscount Price after applying a percentage discount
 * @param {number} price The original price.
 * @param {number} discountPercent The discount percentage (0-100).
 * @return {number} The discounted price rounded to two decimals.
 */
function applyDiscount(price, discountPercent) {
  const base = Number(price);
  const percent = Number(discountPercent);

  // return zero if inputs are not valid numbers
  if (Number.isNaN(base) || Number.isNaN(percent)) {
    return 0;
  }

  // clamp the discount between 0 and 100
  const safePercent = Math.min(Math.max(percent, 0), 100);
  const payable = base - (base * safePercent) / 100;

  return Math.round(payable * 100) / 100;
}

/**
 * Mask all but the last few characters of a value (for example a card number).
 * @name maskValue Mask a value keeping the last N characters
 * @param {string} value The value to mask.
 * @param {number} visibleCount Number of trailing characters to keep visible.
 * @return {string} The masked value.
 */
function maskValue(value, visibleCount) {
  const text = value == null ? '' : String(value);
  const visible = Number.isNaN(Number(visibleCount)) ? 4 : Number(visibleCount);

  if (text.length <= visible) {
    return text;
  }

  const maskedLength = text.length - visible;
  return '*'.repeat(maskedLength) + text.slice(maskedLength);
}

// eslint-disable-next-line import/prefer-default-export
export {
  getFullName,
  days,
  submitFormArrayToString,
  calculateAge,
  toTitleCase,
  applyDiscount,
  maskValue,
};
