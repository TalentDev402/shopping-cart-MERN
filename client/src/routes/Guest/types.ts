import { ComponentType } from "react";

export interface LocationStates {
  "/"?: {};
  "/home2"?: {};
  "/products": {};
  "/search": {};
  "/product/:id"?: {};
  "/product-detail-2"?: {};
  "/page-collection"?: {};
  "/page-collection-2"?: {};
  "/page-search"?: {};
  "/home-header-2"?: {};
  "/account/info"?: {};
  "/account/savelists"?: {};
  "/account/change-password"?: {};
  "/account/billing"?: {};
  "/account/order"?: {};
  "/cart"?: {};
  "/checkout"?: {};
  "/blog"?: {};
  "/blog-single"?: {};
  "/about"?: {};
  "/contact"?: {};
  "/login"?: {};
  "/signup"?: {};
  "/forgot-pass"?: {};
  "/page404"?: {};
  "/subscription"?: {};
  "/membership": {};
  "/news": {};
  "/delivery-methods": {};
  "/privacy-policy": {};
  "/shopping-payment-terms": {};
  "/return-replacement-policy": {};
  "/service": {};
}

export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  component: ComponentType<Object>;
  auth?: boolean;
}
