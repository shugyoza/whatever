/*
Compile Error: 
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'ValidateProduct'.
  No index signature with a parameter of type 'string' was found on type 'ValidateProduct'.ts(7053)
Solution:
const map: { [key: string]: any } = {}; // A map of string -> anything you like
*/

export function inputValidator(
  field: HTMLInputElement | HTMLTextAreaElement,
  errorMessages: Array<string[]> // { [key: string]: any } = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (!field.value && field.id !== "subtitle") {
    errorMessages.push([`#error-${field.id}`, `${field.id} must not be empty`]);
  }
  if (field.id === "price" && field.value && !Number(field.value)) {
    errorMessages.push([
      `#error-${field.id}`,
      `${field.id} must be a valid number`,
    ]);
  }

  return errorMessages;
}
