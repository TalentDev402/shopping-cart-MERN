import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AUTHENTICATED_ENTRY } from "config/Admin/AppCofig";
import styled from "@emotion/styled";
import React from "react";
import { RootState } from "store";

const AuthContainer = styled.div(() => ({
  height: "100vh",
}));

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.auth);

  return token ? (
    <Navigate replace to={AUTHENTICATED_ENTRY} />
  ) : (
    <AuthContainer>{children}</AuthContainer>
  );
};

export default AuthLayout;
