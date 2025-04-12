import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "store";

export interface LogoProps {
  img?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  className = "flex-shrink-0",
}) => {
  const [logo, setLogo] = useState('');
  const { pages } = useSelector((state: RootState) => state.setting);
  useEffect(() => {
    setLogo(pages?.dashboard.logo);
  },[pages]);
  return (
    <Link
      to="/"
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
      {/* THIS USE FOR MY CLIENT */}
      {/* PLEASE UN COMMENT BELLOW CODE AND USE IT */}
      <div className="flex items-center gap-x-2">
        <img
          className={`block max-h-11 sm:max-h-14`}
          src={`${process.env.REACT_APP_SERVER_URL}/${logo}`}
          width={50}
          alt="Logo"
        />
        {/* <h1 className="text-xl sm:text-2xl font-bold text-neutral-500 dark:text-neutral-50">Apparel Empire</h1> */}
      </div>
    </Link>
  );
};

export default Logo;
