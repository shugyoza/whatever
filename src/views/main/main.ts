// This would be the first entrance from main.html

// grabbing functions from window global object
// as any to resolve TS compile error, i.e.: Property 'fetchProducts' does not exist on type 'Window & typeof globalThis'.ts(2339)
// this === window
let _products: any[];

bootstrap();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bootstrap() {
  const main: HTMLElement | null = document.querySelector("main");

  if (!main) return;

  const productSection = createHTMLElement("section", ["class", "products"]);
  main.append(productSection);

  // products = fetchProducts(
  //   "/api/products",
  //   {
  //     "Content-Type": "application/json",
  //   },
  //   "POST"
  // );
}
