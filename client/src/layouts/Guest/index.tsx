import React from "react";
import ScrollToTop from "../../layouts/Guest/ScrollToTop";
import Footer from "components/Guest/shared/Footer/Footer";
import SiteHeader from "pages/Guest/SiteHeader";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import GuestRouter from "routes/Guest";
import { RootState } from "store";
import { setCurrentUser } from "store/slices/authSlice";
import { setCompanyInfo, setPages, setProductDisplay } from "store/slices/settingSlice";
import { setCategoryList } from "store/slices/productSlice";
import { apis } from "apis";
import { Helmet, HelmetProvider } from 'react-helmet-async';

import "../../styles/index.scss";
import "../../index.css";
import "../../fonts/line-awesome-1.3.0/css/line-awesome.css";
import "rc-slider/assets/index.css";
import 'react-responsive-pagination/themes/classic.css';

const GuestLayout = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { pages } = useSelector((state: RootState) => state.setting);

  const GetCompanyInfo = async () => {
    try {
      const response: any = await apis.GetCompanyInfo();
      if (response.success) {
        dispatch(setCompanyInfo(response.companyInfo));
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  };

  const GetProductDisplay = async () => {
    try {
      const response: any = await apis.GetProductDisplay();
      if (response.success) {
        dispatch(setProductDisplay(response.productDisplay));
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  const GetPages = async () => {
    try {
      const response: any = await apis.GetPagesSetting();
      if (response.success) {
        dispatch(setPages(response.pages));
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    }
  }

  const getCurrentUser = async () => {
    try {
      const response: any = await apis.GetCurrentUser();
      if (response.success) {
        dispatch(setCurrentUser(response.user));
      } else {
        toast.error(response.message)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const GetCategoryList = async () => {
    try {
      const response: any = await apis.GetCategoryList();
      if (response.success) {
        dispatch(setCategoryList(response.categoryList));
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  React.useEffect(() => {
    if (token) {
      getCurrentUser();
    }
    GetCompanyInfo();
    GetProductDisplay();
    GetCategoryList();
    GetPages();
  }, [token]);

  return (
    <HelmetProvider>
      {pages === null ? <></> : <>
        <Helmet>
          <title>{pages?.dashboard.title}</title>
          <link rel="icon" href={`${process.env.REACT_APP_SERVER_URL}/${pages?.dashboard.icon}`} />
        </Helmet>
        <Toaster position="top-center" />
        <ScrollToTop />
        <SiteHeader />
        <GuestRouter />
        <Footer />
      </>}
    </HelmetProvider>
  );
};

export default GuestLayout;
