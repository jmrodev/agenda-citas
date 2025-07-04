export function parseAndValidateDate(dateObj, fieldName = 'date', allowFuture = true) {
  if (
    !dateObj ||
    typeof dateObj !== 'object' ||
    typeof dateObj.day !== 'number' ||
    typeof dateObj.month !== 'number' ||
    typeof dateObj.year !== 'number'
  ) {
    return `${fieldName} must be an object with day, month, year`;
  }
  const { day, month, year } = dateObj;
  const now = new Date();
  if (
    day < 1 || day > 31 ||
    month < 1 || month > 12 ||
    year < 1900 || year > now.getFullYear() + (allowFuture ? 10 : 0)
  ) {
    return `${fieldName} values out of range`;
  }
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dateObjReal = new Date(dateString);
  if (
    isNaN(dateObjReal.getTime()) ||
    dateObjReal.getUTCDate() !== day ||
    dateObjReal.getUTCMonth() + 1 !== month ||
    dateObjReal.getUTCFullYear() !== year
  ) {
    return `${fieldName} is not a real date`;
  }
  if (!allowFuture && dateObjReal > now) {
    return `${fieldName} cannot be in the future`;
  }
  return null; // null = sin error
} 