const productsSection: HTMLElement | null = document.querySelector(".products");
const form: HTMLElement | null = document.querySelector("section.form");

let products: any[] = [];
let showProducts: boolean = false;
let showForm: boolean = false;
let errorMessages: Array<string[]> = [];

addListeners(
  {
    selector: "button#show-products",
    event: "click",
    method: clickShowHideProducts,
  },
  {
    selector: "button#show-add-product-form",
    event: "click",
    method: clickShowHideForm,
  },
  {
    selector: "button#add-product",
    event: "click",
    method: clickAddProduct,
  },
  { selector: "button#reset", event: "click", method: clickReset }
);

function addListeners(...listeners: Array<Listener>) {
  listeners.forEach((listener) => {
    const { selector, event, method } = listener;
    const element = document.querySelector(selector);
    if (element) {
      element.addEventListener(event, method);
    }
  });
}

function clickShowHideProducts(): void {
  if (!showProducts) {
    fetchProducts();
    showProducts = true;
    updateTextContent("button#show-products", "HIDE PRODUCTS");
  } else {
    const ol = document.querySelector("ol");
    if (!ol) {
      return;
    }
    productsSection?.removeChild(ol);
    showProducts = false;
    updateTextContent("button#show-products", "SHOW PRODUCTS");
  }
}

function clickShowHideForm(): void {
  if (!form) {
    return;
  }

  if (!showForm) {
    showForm = true;
    form.style.display = "block";
    updateTextContent("button#show-add-product-form", "HIDE ADD PRODUCT FORM");
  } else {
    showForm = false;
    form.style.display = "none";
    updateTextContent("button#show-add-product-form", "SHOW ADD PRODUCT FORM");
  }
}

function fetchProducts() {
  return (
    fetch("/api/products", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        if (response.ok) {
          return response.json(); // parses JSON response into native JavaScript objects
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => {
        if (!productsSection) {
          return;
        }

        // start constructing the list
        const ol = createHTMLElement("ol");
        productsSection?.append(ol);

        data.forEach((datum) => {
          const li = createHTMLElement("li");

          const fieldset = createHTMLElement(
            "fieldset",
            ["id", `tile-datum-${datum.id}`],
            ["class", "tile-datum"]
          );

          const ul = createHTMLElement("ul");
          for (const key in datum) {
            const _li = createHTMLElement("li", [
              "text",
              `${key}: ${datum[key]}`,
            ]);
            ul.append(_li);
          }

          fieldset.append(ul);
          li.append(fieldset);
          ol.append(li);
          // end of list construction
        });
      })
      .catch((err) => console.error(err))
  );
}

function updateTextContent(
  selector: string,
  text: string,
  ms: number = 0
): void {
  const element = document.querySelector(selector);
  if (!element) {
    return;
  }

  element.textContent = text;

  if (ms > 0) {
    setTimeout(() => (element.textContent = ""), ms);
  }
}

function createHTMLElement(
  htmlTag: string,
  ...attributes: Array<string[]>
): HTMLElement {
  const element = document.createElement(htmlTag);

  attributes.forEach((_attribute: Array<string>) => {
    const [attribute, value] = _attribute;

    if (attribute === "id" || attribute === "class") {
      element.setAttribute(attribute, value);
    }

    if (attribute === "text") {
      element.textContent = value;
    }
  });

  return element;
}

async function clickAddProduct() {
  // reset previous error states in the array and on display
  errorMessages = [];
  document
    .querySelectorAll(".error")
    .forEach((error) => (error.textContent = ""));

  const inputs = Array.from(document.querySelectorAll("input")).reduce(
    (accumulator, input) => {
      // validate while iterating through all the submitted inputs
      inputValidator(input, errorMessages);

      // compile all the inputs into an object
      accumulator[input.id] = input.value;
      return accumulator;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as any
  );

  // grab value of description since it is a textarea instead of input tag
  const descriptionElement: HTMLTextAreaElement | null = document.querySelector(
    "textarea#description"
  );
  const description = descriptionElement?.value;

  // if there is any invalid input, display the error message(s) and return.
  if (errorMessages.length) {
    errorMessages.forEach((error: string[]) => {
      const [selector, message] = error;
      // show(message, selector);
      updateTextContent(selector, message);
    });

    return;
  }

  // if all inputs are valid, construct the body to make a fetch request
  const body = {
    id: "",
    ...inputs,
    description,
    currency: "USD",
    hashtags: "",
    pictures: "",
    created: `${Date.now()}`,
    lastUpdate: `${Date.now()}`,
  };

  console.log(body);
  //   await fetch("/api/products", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body,
  //   })
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     .then((response: any) => {
  //       if (response.ok) {
  //         show(body);
  //         return response.json(); // parses JSON response into native JavaScript objects
  //       }
  //     })
  //     .catch((err) => console.error(err));
}

function clickReset(): void {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  const textAreas = document.querySelectorAll("textarea");
  textAreas.forEach((textArea) => (textArea.value = ""));

  errorMessages = [];

  const errors = document.querySelectorAll(".error");
  errors.forEach((error) => (error.textContent = ""));
}

/*
Compile Error: 
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'ValidateProduct'.
  No index signature with a parameter of type 'string' was found on type 'ValidateProduct'.ts(7053)
Solution:
const map: { [key: string]: any } = {}; // A map of string -> anything you like
*/
function inputValidator(
  field: HTMLInputElement | HTMLTextAreaElement,
  errorMessages: Array<string[]> // { [key: string]: any } = {};
): void {
  if (!field.value && field.id !== "subtitle" && field.id !== "currency") {
    errorMessages.push([`#error-${field.id}`, `${field.id} must not be empty`]);
  }
  if (field.id === "price" && field.value && !Number(field.value)) {
    errorMessages.push([
      `#error-${field.id}`,
      `${field.id} must be a valid number`,
    ]);
  }
}

export interface Listener {
  selector: string;
  event: string;
  method: () => void;
}
