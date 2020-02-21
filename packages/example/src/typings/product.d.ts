declare namespace Product {
  interface Product {
    name: string;
    location: string;
  }

  interface Progress extends Product {
    percent: number;
  }
}
