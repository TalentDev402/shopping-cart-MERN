import axios, { AxiosHeaders } from "axios";
import { ADMIN_AUTH_TOKEN, CUSTOMER_AUTH_TOKEN } from "utils/constants";
import { signOutSuccess } from "store/slices/authSlice";
import { store } from "store";

const API = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  // baseURL: "http://localhost:5001",
});

API.interceptors.request.use((config) => {
  try {
    let token = null;
    if (window.location.pathname.includes("/admin")) {
      token = localStorage.getItem(ADMIN_AUTH_TOKEN);
    } else {
      token = localStorage.getItem(CUSTOMER_AUTH_TOKEN);
    }

    if (token) {
      const mHeaders = AxiosHeaders.from({
        Authorization: `Bearer ${token}`,
      });

      if (mHeaders) {
        config.headers = mHeaders;
      }
    }
  } catch (error) { }

  return config;
});

API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    try {
      if (error.response.status === 401 && error.response.data.auth === true) {
        store.dispatch(signOutSuccess());
        if (window.location.pathname.includes("/admin")) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        return Promise.reject(error);
      }
    } catch (e) {
      console.log(error);
    }
  }
);

// Auth
const AdminLogin = (data: any) => API.post("/api/v1/auth/admin-login", data);
const AdminChangePassword = (data: any) => API.post("/api/v1/auth/admin-changePassword", data);
const CustomerLogin = (data: any) => API.post('/api/v1/auth/customer-login', data);
const CustomerRegister = (data: any) => API.post('/api/v1/auth/customer-register', data);
const CustomerGoogleAuth = (data: any) => API.post("/api/v1/auth/customer-google", data);
const GetCurrentUser = () => API.get("/api/v1/auth/current-user");

// User
const GetUserList = () => API.get("/api/v1/user/list");
const CreateUser = (data: any) => API.post("/api/v1/user", data);
const DeleteUser = (id: string) => API.delete(`/api/v1/user/${id}`);
const UpdateUser = (id: string, data: any) => API.put(`/api/v1/user/${id}`, data);
const UploadAvatar = (data: any, config: any) => API.post("/api/v1/user/upload-avatar", data, config);

// Supplier
const CreateSupplier = (data: any) => API.post("/api/v1/supplier", data);
const UploadLogo = (data: any, config: any) => API.post("api/v1/supplier/upload-logo", data, config);
const UploadRemarkFile = (data: any, config: any) => API.post("api/v1/supplier/upload-file", data, config);
const GetSupplierList = () => API.get("/api/v1/supplier/list");
const DeleteSupplier = (id: string) => API.delete(`/api/v1/supplier/${id}`);
const UpdateSupplier = (id: string, data: any) => API.put(`/api/v1/supplier/${id}`, data);

// Tag
const CreateTag = (data: any) => API.post("/api/v1/tag", data);
const DeleteTag = (id: string) => API.delete(`/api/v1/tag/${id}`);
const GetTagList = () => API.get("/api/v1/tag/list");

// Category
const CreateCategory = (data: any) => API.post("/api/v1/category", data);
const GetCategoryList = () => API.get("/api/v1/category/list");
const AddSubCategory = (id: string, data: any) => API.post(`/api/v1/category/${id}`, data);
const DeleteCategory = (id: string, category: string) => API.delete(`/api/v1/category/${id}?category=${category}`);
const EditCategory = (id: string, data: any) => API.put(`/api/v1/category/${id}`, data);

// Product
const CreateProduct = (data: any) => API.post("/api/v1/product", data);
const GetProductList = (pagination: any) => API.get(`/api/v1/product/list?current=${pagination.current}&size=${pagination.pageSize}&search=${pagination.search}`);
const GetProductAlertList = (pagination: any) => API.get(`/api/v1/product/alert-list?current=${pagination.current}&size=${pagination.pageSize}`);
const GetProductListForGuest = (data: any) => API.get(`/api/v1/product/listing?category=${data.search}&size=12&current=${data.page}&search=${data.query}`);
const UploadProductPhoto = (data: any, config: any) => API.post("/api/v1/product/upload-photo", data, config);
const DeleteProduct = (id: string) => API.delete(`/api/v1/product/${id}`);
const UpdateProduct = (id: string, data: any) => API.put(`/api/v1/product/${id}`, data);
const FetchProductListByItemNo = (search: string) => API.get(`/api/v1/product/fetch-list?search=${search}`);
const FetchProductListByName = (search: string) => API.get(`/api/v1/product/fetch-listbyname?search=${search}`);

const GetProductById = (id: string) => API.get(`/api/v1/product/${id}`);
const GetDisplayProductList = (tag: string) => API.get(`/api/v1/product/display-list?tag=${tag}`);

// Adjustment
const CreateAdjustment = (data: any) => API.post("/api/v1/adjustment", data);
const GetAdjustmentList = (pagination: any) => API.get(`/api/v1/adjustment/list?current=${pagination.current}&size=${pagination.pageSize}`);
const DeleteAdjustment = (id: string) => API.delete(`/api/v1/adjustment/${id}`);
const EditAdjustment = (id: string, data: any) => API.patch(`/api/v1/adjustment/${id}`, data);

// Setting
const GetSetting = () => API.get("/api/v1/setting");
const GetCompanyInfo = () => API.get("/api/v1/setting/company-info");
const SaveComanyInfoSetting = (data: any) => API.post('/api/v1/setting/company-info', data);
const CreateCurrency = (data: any) => API.post("/api/v1/setting/currency", data);
const UploadNewPagePhoto = (data: any, config: any) => API.post("/api/v1/setting/upload-photo", data, config);
const DeleteCurrency = (currecny: string) => API.delete(`/api/v1/setting/currency?currency=${currecny}`);
const SetBaseCurrency = (data: any) => API.post("/api/v1/setting/currency/base-currency", data);
const GetProductDisplay = () => API.get("/api/v1/setting/product-display");
const CreateProductDisplay = (data: any) => API.post("/api/v1/setting/product-display", data);
const UpdateProductDisplay = (data: any) => API.patch(`/api/v1/setting/product-display`, data);
const DeleteProductDisplay = (index: number) => API.delete(`/api/v1/setting/product-display/${index}`);
const GetPagesSetting = () => API.get("/api/v1/setting/pages");
const SavePageSetting = (data: any) => API.patch(`/api/v1/setting/pages`, data);
const UploadPageImage = (data: any, config: any) => API.post("/api/v1/setting/upload-image", data, config);

// Cart
const AddCart = (data: any) => API.post("/api/v1/cart/add-item", data);
const GetCart = () => API.get("/api/v1/cart");
const ChangeQuantity = (data: any) => API.put("/api/v1/cart/change-quantity", data);
const RemoveItem = (data: any) => API.put("/api/v1/cart/remove-item", data);

// Customer
const CreateCustomer = (data: any) => API.post("/api/v1/customer", data);
const GetCustomerList = () => API.get("/api/v1/customer/list");
const DeleteCustomer = (id: string) => API.delete(`/api/v1/customer/${id}`);
const UpdateCustomer = (id: string, data: any) => API.put(`/api/v1/customer/${id}`, data);
const GetCustomerbyEmail = (data: any) => API.post("/api/v1/customer/getbyemail", data);

// Order
const GetOrderList = () => API.get("/api/v1/order/list");
const UpdateOrder = (id: string, data: any) => API.put(`/api/v1/order/${id}`, data);
const CreateOrder = (data: any) => API.post("/api/v1/order", data);
const GetOrderListbyCustomer = () => API.get("/api/v1/order/customer-list");
const GetSalesRankingList = (startDate: number, endDate: number) => API.get(`/api/v1/order/sales-ranking?start_at=${startDate}&end_at=${endDate}`)
const GetInventoryTrendList = (data: any) => API.post(`/api/v1/order/inventory-trend`, data)
const ExportOrder = (data: any) => API.post(`/api/v1/order/export-order`, data);
const DeleteInvoice = (orderId: string) => API.delete(`/api/v1/order/invoice/${orderId}`);

// ReturnRequest
const CreateRequest = (data: any) => API.post("/api/v1/order/createRequest", data);
const GetRequestList = () => API.get("/api/v1/order/request-list");
const UpdateRequest = (id: string, data: any) => API.put(`/api/v1/order/request/${id}`, data);

// Email
const ContactUs = (data: any) => API.post("/api/v1/email/contact-us", data);

export const apis = {
  // Auth
  AdminLogin,
  AdminChangePassword,
  CustomerLogin,
  CustomerRegister,
  CustomerGoogleAuth,
  GetCurrentUser,

  // User
  CreateUser,
  DeleteUser,
  UpdateUser,
  UploadAvatar,
  GetUserList,

  // Supplier
  CreateSupplier,
  UploadLogo,
  UploadRemarkFile,
  GetSupplierList,
  DeleteSupplier,
  UpdateSupplier,

  // Tag
  CreateTag,
  DeleteTag,
  GetTagList,

  // Category
  CreateCategory,
  GetCategoryList,
  AddSubCategory,
  DeleteCategory,
  EditCategory,

  // Product
  CreateProduct,
  GetProductList,
  GetProductListForGuest,
  UploadProductPhoto,
  DeleteProduct,
  UpdateProduct,
  GetProductById,
  GetDisplayProductList,
  GetProductAlertList,
  FetchProductListByItemNo,
  FetchProductListByName,

  // Adjustment
  CreateAdjustment,
  GetAdjustmentList,
  DeleteAdjustment,
  EditAdjustment,

  // Setting
  GetSetting,
  GetCompanyInfo,
  SaveComanyInfoSetting,
  CreateCurrency,
  UploadNewPagePhoto,
  DeleteCurrency,
  SetBaseCurrency,
  GetProductDisplay,
  CreateProductDisplay,
  UpdateProductDisplay,
  DeleteProductDisplay,
  SavePageSetting,
  UploadPageImage,
  GetPagesSetting,

  // Cart
  AddCart,
  GetCart,
  ChangeQuantity,
  RemoveItem,

  // Customer
  CreateCustomer,
  UpdateCustomer,
  GetCustomerList,
  DeleteCustomer,
  GetCustomerbyEmail,

  // Order
  CreateOrder,
  UpdateOrder,
  GetOrderList,
  GetOrderListbyCustomer,
  GetSalesRankingList,
  GetInventoryTrendList,
  ExportOrder,
  DeleteInvoice,

  // ReturnRequest
  CreateRequest,
  GetRequestList,
  UpdateRequest,

  // Email
  ContactUs
};
