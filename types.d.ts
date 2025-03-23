// types.d.ts
declare module "*.json" {
  interface LoginSelectors {
    username: string;
    password: string;
    submitButton: string;
  }

  interface ProductSelectors {
    sizeDropdown: string;
    colorDropdown: string;
    viewCartButton: string;
    addToCartButton: string;
  }

  interface CartSelectors {
    cartTotal: string;
    proceedToCheckout: string;
    removeItemButton: string;
    cartItem: string;
  }

  interface CheckoutSelectors {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postcode: string;
    placeOrderButton: string;
    orderConfirmation: string;
    editShippingAddress: {
      container: string;
      button: string;
      css: string;
    };
    orderReceivedHeading: {
      role: string;
      name: string;
    };
  }

  interface ProductOptions {
    size: string;
    color: string;
    expectedPrice: string;
  }

  interface DefaultProduct {
    slug: string;
    options: ProductOptions;
  }

  interface UserCredentials {
    username: string;
    password: string;
  }

  interface ShippingDetails {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postcode: string;
  }

  interface SiteConfig {
    baseURL: string;
    selectors: {
      login: LoginSelectors;
      product: ProductSelectors;
      cart: CartSelectors;
      checkout: CheckoutSelectors;
    };
    products: {
      defaultProduct: ProductConfig;
      hoodie?: ProductConfig; // Make optional if not all sites have it
      sweatshirt?: ProductConfig;
    };

    users: {
      valid: UserCredentials;
    };
    testData: {
      shippingDetails: ShippingDetails;
    };
  }

  const config: SiteConfig;
  export default config;
  export { ShippingDetails }; // Explicitly export the type
}
