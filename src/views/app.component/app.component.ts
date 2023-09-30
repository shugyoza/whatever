/* 
instead of having imports, may be we can just store all the shared methods and variables in the template
with JSON.stringify() with a display none, and every js can just grab it at runtime from the template
parse it, and use it
*/
const productsSection: HTMLElement | null = document.querySelector(".products");
const form: HTMLDialogElement | null = document.querySelector("dialog.form");

let products: any[] = [];
let showProducts: boolean = false;
let errorMessages: Array<string[]> = [];
let toggle: boolean = false;

addListeners(
  {
    selector: "button#show-products",
    event: "click",
    method: clickShowHideProducts,
  },
  {
    selector: "button#add-product",
    event: "click",
    method: clickShowHideForm,
  },
  {
    selector: "button.save",
    event: "click",
    method: clickSave,
  },
  { selector: "button#reset", event: "click", method: clickResetForm },
  {
    selector: "button#close-form",
    event: "click",
    method: clickCloseFormDialog,
  },
  {
    selector: "section.products",
    event: "click",
    method: clickUpdateProduct,
  }
);

function addListeners(...listeners: Array<Listener>) {
  listeners.forEach((listener) => {
    const { selector, event, method } = listener;
    const elements = document.querySelectorAll(selector);

    if (!elements || !elements.length) {
      return;
    }

    elements.forEach((element: Element) => {
      element.addEventListener(event, method);
    });
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

  if (form.open) {
    form.close();
  } else {
    form.showModal();
  }

  clickResetForm();
}

function clickUpdateProduct(): void {
  // This ..as Element is needed to counter TS error: ..property id does not exist on EventTarget
  const buttonId = (event?.target as Element).id;

  if (!form || !buttonId) {
    return;
  }

  const selector = "button#" + buttonId;
  // .dataset exists on HTMLElement type. This is to resolve TS error: Property 'dataset' does not exist on type 'Element'.ts(2339)
  const button: HTMLElement | null = document.querySelector(selector);

  if (!button) {
    return;
  }

  // const id = buttonId.slice(buttonId.indexOf("-") + 1);
  const datum = button.dataset.product
    ? JSON.parse(button.dataset.product)
    : {};

  if (form.open) {
    form.close();
  } else {
    form.showModal();
    document.querySelectorAll("input").forEach((input) => {
      switch (input.id) {
        case "title":
          input.value = datum.title;
          break;
        case "subtitle":
          input.value = datum.subtitle;
          break;
        case "price":
          input.value = datum.price;
          break;
        case "currency":
          input.value = datum.currency;
          break;
        case "picture":
          input.value = datum.picture;
          break;
        case "hashtags":
          input.value = datum.hashtags;
          break;
      }
    });

    updateTextContent("button.save", "SAVE UPDATE");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prefillField(inputField: "input" | "textarea", datum: any) {
  document.querySelectorAll("input").forEach((input) => {
    switch (input.id) {
      case "title":
        input.value = datum.title;
        break;
      case "subtitle":
        input.value = datum.subtitle;
        break;
      case "price":
        input.value = datum.price;
        break;
      case "currency":
        input.value = datum.currency;
        break;
      case "picture":
        input.value = datum.picture;
        break;
      case "hashtags":
        input.value = datum.hashtags;
        break;
    }
  });
}

function fetchProducts(
  urlPath: string = "/api/products",
  contentType: { [key: string]: string } = {
    "Content-Type": "application/json",
  },
  method: string = "GET",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
) {
  const req = {
    method,
    headers: {
      ...contentType,
      // "Content-Type": "application/json",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  if (body) {
    req.body = body;
  }

  return (
    fetch(urlPath, req)
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
          const olLi = createHTMLElement("li");
          const fieldset = createHTMLElement(
            "fieldset",
            ["id", `tile-datum-${datum.id}`],
            ["class", "tile-datum"]
          );
          const ul = createHTMLElement("ul");
          for (const key in datum) {
            if (key === "title") {
              const ulLi = createHTMLElement("h3", ["text", `${datum[key]}`]);
              ul.append(ulLi);
            } else if (key === "price") {
              const ulLi = createHTMLElement("li", ["text", "$" + datum[key]]);
              ul.append(ulLi);
            } else if (
              key === "subtitle" ||
              key === "description" ||
              key === "picture" ||
              key === "hashtags"
            ) {
              const ulLi = createHTMLElement("li", ["text", `${datum[key]}`]);
              ul.append(ulLi);
            }
          }
          const updateButton = createHTMLElement(
            "button",
            ["text", "UPDATE PRODUCT"],
            ["class", "update"],
            ["id", `update-${datum.id}`],
            // store the datum as dataset in the html to populate the pop up form for update
            ["data-product", JSON.stringify(datum)]
          );
          fieldset.append(ul);
          fieldset.append(updateButton);
          olLi.append(fieldset);
          ol.append(olLi);
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
  const elements = document.querySelectorAll(selector);

  if (!elements || !elements.length) {
    return;
  }

  elements.forEach((element) => {
    element.textContent = text;

    if (ms > 0) {
      setTimeout(() => (element.textContent = ""), 0);
    }
  });
}

function createHTMLElement(
  htmlTag: string,
  ...attributes: Array<string[]>
): HTMLElement | HTMLInputElement {
  const element: HTMLElement | HTMLInputElement =
    document.createElement(htmlTag);

  attributes.forEach((_attribute: Array<string>) => {
    const [attribute, value] = _attribute;

    if (
      attribute === "id" ||
      attribute === "class" ||
      attribute.startsWith("data-") // this is to store data
    ) {
      element.setAttribute(attribute, value);
    }

    if (attribute === "value") {
      element.setAttribute(attribute, value);
      element.setAttribute("disabled", "true");
    }

    if (attribute === "text") {
      element.textContent = value;
    }
  });

  return element;
}

async function clickSave() {
  console.log("clickSave");

  // reset previous error states in the array and on display
  errorMessages = [];
  updateTextContent(".error", "");

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
  const textAreas = Array.from(document.querySelectorAll("textarea")).reduce(
    (accumulator, textArea) => {
      // validate while iterating through all the submitted textareas
      inputValidator(textArea, errorMessages);

      // compile all the textareas into an object
      accumulator[textArea.id] = textArea.value;
      return accumulator;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as any
  );

  // if there is any invalid input, display the error message(s) and return.
  if (errorMessages.length) {
    errorMessages.forEach((error: string[]) => {
      const [selector, message] = error;
      updateTextContent(selector, message);
    });

    return;
  }

  // if all inputs are valid, construct the body to make a fetch request
  const body = {
    id: "",
    ...inputs,
    ...textAreas,
    currency: "USD",
    hashtags: "",
    pictures: "",
    created: `${Date.now()}`,
    lastUpdate: `${Date.now()}`,
  };

  console.log(body);
  //   await fetch("/api/products", {
  //     method,
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

function clickResetForm(): void {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  const textAreas = document.querySelectorAll("textarea");
  textAreas.forEach((textArea) => (textArea.value = ""));

  errorMessages = [];
  updateTextContent(".error", "");
}

function clickCloseFormDialog(): void {
  const dialog: HTMLDialogElement | null =
    document.querySelector("dialog.form");

  if (dialog) {
    dialog.close();
  }
}

/*
Compile Error: 
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'ValidateProduct'.
  No index signature with a parameter of type 'string' was found on type 'ValidateProduct'.ts(7053)
Solution:
const map: { [key: string]: any } = {}; // A map of string -> anything you like
*/
/*
function inputValidator(
  field: HTMLInputElement | HTMLTextAreaElement,
  errorMessages: Array<string[]> // { [key: string]: any } = {};
): void {
  switch (field.id) {
    case "title":
      if (!field.value) {
        errorMessages.push([`#error-${field.id}`, "must not be empty"]);
      }
      break;

    case "price":
      if (!field.value) {
        errorMessages.push([`#error-${field.id}`, "must not be empty"]);
      } else if (!Number(field.value)) {
        errorMessages.push([`#error-${field.id}`, "must be a valid number"]);
      }
  }
}
*/

interface Listener {
  selector: string;
  event: string;
  method: () => void;
}
