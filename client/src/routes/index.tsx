import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

const AdminLayout = React.lazy(() => import("layouts/Admin"));
const GuestLayout = React.lazy(() => import("layouts/Guest"));

const AppRouter = () => {

  return (
    <Router>
      {window.location.pathname.includes("/admin") ? (
        <AdminLayout />
      ) : (
        <GuestLayout />
      )}
       {/* <AdminLayout /> */}
    </Router>
  );
};

export default AppRouter;
