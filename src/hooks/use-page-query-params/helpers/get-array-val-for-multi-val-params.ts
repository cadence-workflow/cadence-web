/**
 * @param {string | null | (string | null)[]} val
 * @param {boolean} isMultiValue
 * @returns {string | null | string[]} arrayfiedVal
 *
 * This function accepts a value for a query param and a flag to indicate if the param is a multivalue param or not
 * The function then returns the value while making sure it is an array value if it is a multivalue param
 * The benifit behind using this function instead of using the value directly is that if you add multiple values for the same query param it would be changed from a single string to an array of strings, in order to avoid check for this case
 * within the whole codebase we just mark the values that we plan to contain multiple values and we return them as arrays even if they had a single value
 */
const getArrayValForMultiValParams = (
  val: string | null | (string | null)[],
  isMultiValue: Boolean
) => {
  if (isMultiValue) {
    const arr = !Array.isArray(val) ? [val] : val;
    return arr.filter((v) => v !== null) as string[];
  }
  return Array.isArray(val) ? val[0] : val;
};

export default getArrayValForMultiValParams;
