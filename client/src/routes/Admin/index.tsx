import { Routes, Route, Navigate } from "react-router-dom";
import { AdminPublicRoutes, AdminPrivateRoutes } from "config/RoutesConfig";
import { AUTHENTICATED_ENTRY } from "config/Admin/AppCofig";

import AppLayout from "layouts/Admin/AppLayout";
import AuthLayout from "layouts/Admin/AuthLayout";

const AdminRouter = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={<Navigate replace to={AUTHENTICATED_ENTRY} />}
      />
      {AdminPrivateRoutes.map((route) => (
        <Route
          key={route.key}
          path={route.path}
          element={<AppLayout children={route.element} />}
        />
      ))}
      {AdminPublicRoutes.map((route) => (
        <Route
          key={route.key}
          path={route.path}
          element={<AuthLayout children={route.element} />}
        />
      ))}
    </Routes>
  );
};

export default AdminRouter;
