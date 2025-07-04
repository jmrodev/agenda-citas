function parseAndValidateDate(dateObj, fieldName = 'date', allowFuture = true) {
  if (
    !dateObj ||
    typeof dateObj !== 'object' ||
    typeof dateObj.day !== 'number' ||
    typeof dateObj.month !== 'number' ||
    typeof dateObj.year !== 'number'
  ) {
    throw new Error(`${fieldName} must be an object with day, month, year`);
  }
  const { day, month, year } = dateObj;
  if (
    day < 1 || day > 31 ||
    month < 1 || month > 12 ||
    year < 1900 || year > new Date().getFullYear() + (allowFuture ? 10 : 0)
  ) {
    throw new Error(`${fieldName} values out of range`);
  }
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dateObjReal = new Date(dateString);
  if (
    isNaN(dateObjReal.getTime()) ||
    dateObjReal.getUTCDate() !== day ||
    dateObjReal.getUTCMonth() + 1 !== month ||
    dateObjReal.getUTCFullYear() !== year
  ) {
    throw new Error(`${fieldName} is not a real date`);
  }
  if (!allowFuture && dateObjReal > new Date()) {
    throw new Error(`${fieldName} cannot be in the future`);
  }
  return dateString;
}

module.exports = { parseAndValidateDate }; 