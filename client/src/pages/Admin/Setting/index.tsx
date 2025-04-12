import React from "react";
import { apis } from "apis";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSetting } from "store/slices/settingSlice";

import AccountSetting from "./AccountSetting";
import GeneralSetting from "./GeneralSetting";
import CustomPages from "./CustomPages";
import Language from "./Language";
import ShippingMethods from "./ShippingMethods";
import Layout from "./Layout";
import Theme from "./Theme";

const Setting = () => {
  const dispatch = useDispatch();

  const GetSetting = async () => {
    try {
      const response: any = apis.GetSetting();
      if (response.success) {
        dispatch(setSetting(response.setting));
      }
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    GetSetting();
  }, []);

  return (
    <Routes>
      <Route path="account" element={<AccountSetting />} />
      <Route path="general" element={<GeneralSetting />} />
      <Route path="custom-pages" element={<CustomPages />} />
      <Route path="language" element={<Language />} />
      <Route path="shipping-methods" element={<ShippingMethods />} />
      <Route path="layout" element={<Layout />} />
      <Route path="theme" element={<Theme />} />
      <Route path="*" element={<Navigate to="general" replace />} />
    </Routes>
  );
};

export default Setting;
