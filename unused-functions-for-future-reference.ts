// function to import and export function to html dataset
// does not work because we cannot make a call using a non native method stored in an object's property
// e.g. // Uncaught TypeError: functions.fetchProducts is not a function
function importFunctionsFromHTMLDataset(selector: string = "body") {
  const htmlElement: HTMLElement | null = document.querySelector(selector);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const functionsMap: { [key: string]: any } = {};

  if (!htmlElement || !htmlElement.dataset) return;

  for (const key in htmlElement.dataset) {
    const stringifiedFunction = htmlElement.dataset[key];
    // instantiate a function factory that returns our true function
    const functionFactory = new Function("return " + stringifiedFunction);
    // call the function factory/higher order function to return our true function
    const trueFunction = functionFactory();
    // store it in our functionMap (similar to CommonJS' module to import)
    functionsMap[key] = trueFunction;
  }

  return functionsMap;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportFunctionsToHTMLDataset(functions: { [key: string]: any }) {
  const htmlBody = document.querySelector("body"); // to stick the dataset

  if (!htmlBody) return;

  for (const name in functions) {
    const stringifiedFunction = functions[name].toString();
    const attribute = "data-" + name;
    htmlBody.setAttribute(attribute, stringifiedFunction);
  }

  return htmlBody;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stringifyFunction(_function: any): string {
  return _function.toString();
}

// function to convert a stringified function back to a function, i.e. const varName = parseFunction(stringifiedFunction)
function parseStringifiedFunction(
  stringifiedFunction: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
  // functionFactory is a closure, i.e.: function that returns another function
  // in this case function that previously we stringified
  const functionFactory = new Function("return " + stringifiedFunction);
  const trueFunction = functionFactory();

  return trueFunction;
}
