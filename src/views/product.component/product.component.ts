import { inputValidator } from "../validators/validators";

let errorMessages: Array<string[]> = [];

document
  .querySelector("button#add-product")
  ?.addEventListener("click", clickAddProduct);

document.querySelector("button#reset")?.addEventListener("click", reset);

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
      show(message, selector);
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
  //     mode: "cors",
  //     cache: "no-cache",
  //     credentials: "same-origin",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     redirect: "follow",
  //     referrerPolicy: "no-referrer",
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

function reset(): void {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  const textAreas = document.querySelectorAll("textarea");
  textAreas.forEach((textArea) => (textArea.value = ""));

  errorMessages = [];

  const errors = document.querySelectorAll(".error");
  errors.forEach((error) => (error.textContent = ""));
}

function show(text: string, selector: string, ms: number = 0) {
  const display = document.querySelector(selector);

  if (!display) {
    return;
  }

  display.textContent = text;

  if (ms > 0) {
    setTimeout(() => (display.textContent = ""), ms);
  }
}
