// Admin Pages//
import AdminLogin from "pages/Admin/Login";
import AccountSetting from "pages/Admin/Setting/AccountSetting";
import UserList from "pages/Admin/UserList";
import CustomerList from "pages/Admin/CustomerList";
import SupplierList from "pages/Admin/SupplierList";
import CategoryTagList from "pages/Admin/CategoryTagList";
import ProductList from "pages/Admin/ProductList";
import AdjustmentList from "pages/Admin/AdjustmentList";
import OrderList from "pages/Admin/OrderList";
import RequestList from "pages/Admin/ReturnRequestList";
import Setting from "pages/Admin/Setting";
import InventoryAlertList from "pages/Admin/ReportList/InventoryAlert";
import SalesRankingList from "pages/Admin/ReportList/SalesRanking";
import InventoryTrendList from "pages/Admin/ReportList/InventoryTrend";
import { IRouteType } from "utils/types";

export const AdminPublicRoutes: Array<IRouteType> = [
  {
    key: "admin-login",
    path: "/admin/login",
    element: <AdminLogin />,
  },
];

export const AdminPrivateRoutes: Array<IRouteType> = [
  {
    key: "admin-dashboard",
    path: "/admin/dashboard",
    element: <>Dahsbord</>,
  },
  {
    key: "admin-changePassword",
    path: "/admin/changePassword",
    element: <AccountSetting/>,
  },
  {
    key: "admin-user-list",
    path: "/admin/users",
    element: <UserList />,
    isSuper: true,
  },
  {
    key: "admin-customer-list",
    path: "/admin/customers",
    element: <CustomerList />,
  },
  {
    key: "admin-supplier-list",
    path: "/admin/suppliers",
    element: <SupplierList />,
  },
  {
    key: "admin-category-tag-list",
    path: "/admin/category_tags",
    element: <CategoryTagList />,
  },
  {
    key: "admin-stock-product-list",
    path: "/admin/stock/product-list",
    element: <ProductList />,
  },
  {
    key: "admin-stock-adjustment-list",
    path: "/admin/stock/adjustment-list",
    element: <AdjustmentList />,
  },
  {
    key: "admin-order-list",
    path: "/admin/order/list",
    element: <OrderList />,
  },
  {
    key: "admin-order-return-requset-list",
    path: "/admin/order/request-list",
    element: <RequestList />,
  },
  {
    key: "admin-report-sales-ranking",
    path: "/admin/report/sales-ranking",
    element: <SalesRankingList />,
  },
  {
    key: "admin-report-inventory-alert",
    path: "/admin/report/inventory-alert",
    element: <InventoryAlertList />
  },
  {
    key: "admin-report-inventory-trend",
    path: "/admin/report/inventory-trend",
    element: <InventoryTrendList />
  },
  {
    key: "admin-setting",
    path: "/admin/setting/*",
    element: <Setting />,
  },
];
