import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "store";

const Footer: React.FC = () => {
  const { companyInfo } = useSelector((state: RootState) => state.setting);
  const [logo, setLogo] = useState('');
  const { pages } = useSelector((state: RootState) => state.setting);
  useEffect(() => {
    setLogo(pages?.dashboard.logo);
  },[pages]);

  return (
    <div className="nc-Footer relative py-3 md:py-6 border-t border-neutral-200 dark:border-neutral-700 mt-5">
      <div className="container grid grid-cols-1 md:grid-cols-7">
        <div className="col-span-1 flex justify-center">
          <img src={`${process.env.REACT_APP_SERVER_URL}/${logo}`} width={120} />
        </div>
        <div className="mt-5 col-span-1 md:col-span-4 md:mt-0 flex flex-col gap-1 md:gap-2 justify-center">
          <h1 className="font-bold text-xl md:text-2xl">{companyInfo?.name}</h1>
          <h1 className="text-md">{companyInfo?.address}</h1>
          <h1 className="text-md">{companyInfo?.phone}</h1>
        </div>
        <div className="col-span-1 md:col-span-2 mt-5 md:mt-0 text-xl flex items-center justify-center">
          <div className="w-full max-w-[320px] text-neutral-500">
            <div className="flex justify-between">
              <div>|</div>
              <div><Link to={"/membership"} className="hover:text-[#0000FF]">會員積分</Link></div>
              <div>|</div>
              <div><Link to={"/news"} className="hover:text-[#0000FF]">公司動態</Link></div>
              <div>|</div>
            </div>

            <div className="flex justify-between">
              <div>|</div>
              <div><Link to={"/delivery-methods"} className="hover:text-[#0000FF]">送貨安排</Link></div>
              <div>|</div>
              <div><Link to={"/privacy-policy"} className="hover:text-[#0000FF]">隱私政策</Link></div>
              <div>|</div>
            </div>

            <div className="flex justify-between">
              <div>|</div>
              <div><Link to={"/shopping-payment-terms"} className="hover:text-[#0000FF]">購物與付款</Link></div>
              <div>|</div>
              <div><Link to={"/return-replacement-policy"} className="hover:text-[#0000FF]">退換貨政策</Link></div>
              <div>|</div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 mt-3 md:mt-6">
        <h1 className="text-center text-md mt-3 md:mt-6">
          © {new Date().getFullYear()} All right reserved by {companyInfo?.name}
        </h1>
      </div>
    </div>
  );
};

export default Footer;
