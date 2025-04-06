// types.d.ts
type AriaRole = "heading" | "text" | "link" | "button" | "status" | "alert";

declare module "*.json" {
  interface LoginSelectors {
    username: string;
    password: string;
    submitButton: string;
    errorMessage: string;
    myAccountHeading: {
      role: AriaRole;
      name: string;
    };
    signOutText?: string;
  }

  interface ProductSelectors {
    sizeDropdown: string;
    colorDropdown: string;
    viewCartButton: string;
    addToCartButton: string;
  }

  interface CartSelectors {
    carticon: string;
    cartTotal: string;
    proceedToCheckoutButton: string;
    removeItemButton: string;
    quantityInput: string;
    cartItemTitle: string;
    emptyCartMessage: {
      role: AriaRole;
      name: string;
    };
    removalNotification: string;
  }

  interface CheckoutSelectors {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
    phone: string;
    placeOrderButton: string;
    orderConfirmation: string;
    editShippingAddress: {
      container: string;
      button: string;
    };
    orderReceivedHeading: {
      role: AriaRole;
      name: string;
    };
  }

  interface ProductOptions {
    size: string;
    color: string;
    expectedPrice: string;
  }

  interface ProductConfig {
    title: string;
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
    country?: string;
    state?: string;
    phone?: string;
  }

  interface SiteConfig {
    baseURL: string;
    paths: {
      myAccount: string;
      product: string;
      checkout: string;
      cart: string;
      orderReceived: string;
    };
    selectors: {
      login: LoginSelectors;
      product: ProductSelectors;
      cart: CartSelectors;
      checkout: CheckoutSelectors;
    };
    products: {
      defaultProduct: ProductConfig;
      hoodie?: ProductConfig;
      sweatshirt?: ProductConfig;
      mug?: ProductConfig;
    };
    users: {
      valid: UserCredentials;
      invalid: UserCredentials;
    };
    errorMessages: {
      loginError: string;
    };
    testData: {
      shippingDetails: ShippingDetails;
    };
  }

  const config: SiteConfig;
  export default config;
  export {
    AriaRole,
    ShippingDetails,
    UserCredentials,
    ProductConfig,
    SiteConfig,
  };
}
