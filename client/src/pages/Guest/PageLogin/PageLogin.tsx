import React, { FC } from "react";
// import facebookSvg from "assets/images/Facebook.svg";
// import twitterSvg from "assets/images/Twitter.svg";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Input from "components/Guest/shared/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import { apis } from "apis";
import { signInSuccess } from "store/slices/authSlice";
import { store } from "store";
import toast from 'react-hot-toast';
import GoogleLogin from "components/Guest/utils/SocialAuth/GoogleLogin";

export interface PageLoginProps {
  className?: string;
}

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const navigate = useNavigate();

  const login = async (event: any) => {
    try {
      event.preventDefault();
      const response: any = await apis.CustomerLogin({
        email: event.target['email'].value,
        password: event.target['password'].value,
      });
      if (response.token) {
        navigate("/account/change-password");
        store.dispatch(signInSuccess(response.token));
        toast.success(response.message);
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}>
              <GoogleLogin />
            </GoogleOAuthProvider>
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={login} >
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                name="email"
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input type="password" className="mt-1" name="password" />
            </label>
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link className="text-green-600" to="/signup">
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
