import { Routes, Route } from "react-router-dom";
import { Page } from "./types";
import PageHome from "pages/Guest/PageHome/PageHome";
import Page404 from "pages/Guest/Page404/Page404";
import AccountPage from "pages/Guest/AccountPage/AccountPage";
import PageContact from "pages/Guest/PageContact/PageContact";
import PageAbout from "pages/Guest/PageAbout/PageAbout";
import PageSignUp from "pages/Guest/PageSignUp/PageSignUp";
import PageLogin from "pages/Guest/PageLogin/PageLogin";
// import PageSubcription from "pages/Guest/PageSubcription/PageSubcription";
// import BlogPage from "pages/Guest/BlogPage/BlogPage";/
// import BlogSingle from "pages/Guest/BlogPage/BlogSingle";
import PageCollection from "pages/Guest/PageCollection";
// import PageSearch from "pages/Guest/PageSearch";
// import PageHome2 from "pages/Guest/PageHome/PageHome2";
import ProductDetailPage from "pages/Guest/ProductDetailPage/ProductDetailPage";
// import ProductDetailPage2 from "pages/Guest/ProductDetailPage/ProductDetailPage2";
// import AccountSavelists from "pages/Guest/AccountPage/AccountSavelists";
import AccountPass from "pages/Guest/AccountPage/AccountPass";
// import AccountBilling from "pages/Guest/AccountPage/AccountBilling";
import AccountOrder from "pages/Guest/AccountPage/AccountOrder";
import CartPage from "pages/Guest/ProductDetailPage/CartPage";
import CheckoutPage from "pages/Guest/PageCheckout/CheckoutPage";
// import PageCollection2 from "pages/Guest/PageCollection2";
import ProductSearch from "pages/Guest/ProductSearch/ProductSearch";
import PrivateRoute from "layouts/Guest/PrivateRoute";
import MembershipPage from "pages/Guest/MembershipPage";
import NewsPage from "pages/Guest/News";
import DeliveryMethodsPage from "pages/Guest/DeliveryMethodsPage";
import PrivacyPolicyPage from "pages/Guest/PrivacyPolicyPage";
import ShoppingPaymentTerms from "pages/Guest/ShoppingPaymentTerms";
import ReturnReplacementPolicy from "pages/Guest/ReturnReplacementPolicy";
import ServicePage from "pages/Guest/ServicePage";

export const pages: Page[] = [
  { path: "/", component: PageHome },
  // { path: "/home2", component: PageHome2 },
  //
  // { path: "/home-header-2", component: PageHome },
  { path: "/product/:id", component: ProductDetailPage },
  { path: "/search", component: ProductSearch },
  // { path: "/product-detail-2", component: ProductDetailPage2 },
  //
  // { path: "/page-collection-2", component: PageCollection2 },
  { path: "/products", component: PageCollection },
  // { path: "/page-search", component: PageSearch },
  //
  { path: "/account/info", component: AccountPage },
  // { path: "/account-savelists", component: AccountSavelists },
  { path: "/account/change-password", component: AccountPass },
  // { path: "/account/billing", component: AccountBilling },
  { path: "/account/order", component: AccountOrder, auth: true },
  { path: "/cart", component: CartPage, auth: true },
  { path: "/checkout", component: CheckoutPage, auth: true },
  //
  // { path: "/blog", component: BlogPage },
  // { path: "/blog-single", component: BlogSingle },
  //
  { path: "/contact", component: PageContact },
  { path: "/about", component: PageAbout },
  { path: "/signup", component: PageSignUp },
  { path: "/login", component: PageLogin },
  { path: "/membership", component: MembershipPage },
  { path: "/news", component: NewsPage },
  { path: "/delivery-methods", component: DeliveryMethodsPage },
  { path: "/privacy-policy", component: PrivacyPolicyPage },
  { path: "/shopping-payment-terms", component: ShoppingPaymentTerms },
  { path: "/return-replacement-policy", component: ReturnReplacementPolicy },
  { path: "/service", component: ServicePage }
  // { path: "/subscription", component: PageSubcription },
];

const GuestRouter = () => {
  return (
    <Routes>
      {pages.map(({ component: Component, path, auth }, index) => {
        return <Route key={index} element={auth ? <PrivateRoute children={<Component />} /> : <Component />} path={path} />;
      })}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default GuestRouter;
