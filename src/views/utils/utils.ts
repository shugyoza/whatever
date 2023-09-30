function addEventListeners(...listeners: Array<Listener>) {
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

interface Listener {
  selector: string;
  event: string;
  method: () => void;
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

function fetchProducts(
  urlPath: string = "/api/products",
  contentType: { [key: string]: string } = {
    "Content-Type": "application/json",
  },
  method: string = "GET",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: any[] = [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
) {
  const req = {
    method,
    headers: {
      ...contentType,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  if (body) req.body = body;

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
        store = [...data];
        return data;
      })
      .catch((err) => console.error(err))
  );
}

export function hellokitty() {
  console.log("helloKitty");
}
