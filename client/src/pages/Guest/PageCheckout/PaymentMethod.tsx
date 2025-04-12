import React, { FC, useState } from "react";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import ButtonSecondary from "components/Guest/shared/Button/ButtonSecondary";
// import Input from "components/Guest/shared/Input/Input";
import Radio from "components/Guest/shared/Radio/Radio";
import { setPaymentMethod } from "store/slices/orderSlice";
import { useSelector } from "react-redux";
import { RootState, store } from "store";

interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
}

const PaymentMethod: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
}) => {
  const { paymentMethod } = useSelector((state: RootState) => state.order);
  const [methodActive, setMethodActive] = useState("");

  React.useEffect(() => {
    setMethodActive(
      paymentMethod ? paymentMethod : "Transfer via bank account"
    );
  }, [paymentMethod]);

  // const renderCashOnDelivery = () => {
  //   const active = methodActive === "Cash on delivery";
  //   return (
  //     <div className="flex items-start space-x-4 sm:space-x-6">
  //       <Radio
  //         className="pt-5.5"
  //         name="payment-method"
  //         id="Cash on delivery"
  //         defaultChecked={active}
  //         onChange={(e) => setMethodActive(e as any)}
  //       />
  //       <div className="flex-1">
  //         <label
  //           htmlFor="Cash on delivery"
  //           className="flex items-center space-x-4 sm:space-x-6"
  //         >
  //           <p className="text-medium">貨到付款： 收貨時直接付現金予司機（須自備零錢不設找贖）</p>
  //         </label>
  //       </div>
  //     </div>
  //   );
  // };

  const renderBankAccount = () => {
    const active = methodActive === "Transfer via bank account";
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-5.5"
          name="payment-method"
          id="Transfer via bank account"
          defaultChecked={active}
          onChange={(e) => setMethodActive(e as any)}
        />
        <div className="flex-1">
          <label
            htmlFor="Transfer via bank account"
            className="flex items-center space-x-4 sm:space-x-6"
          >
            <p>
              <p className="font-medium">
                銀行轉帳：
                <br />
                中國銀行(012-581-2-023072-3) <br />
                珍品匯有限公司(COLLECTION OF TREASURES LIMITED)
              </p>
              <br />
              <p className="font-medium" style={{ color: "red" }}>
                **轉帳後請將收據及訂單號 WhatsApp 至 +852-37957455
                <br />
                或電郵到 cot.info813@gmail.com
              </p>
            </p>
          </label>
        </div>
      </div>
    );
  };

  const renderFPS = () => {
    const active = methodActive === "FPS";
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-5.5"
          name="payment-method"
          id="FPS"
          defaultChecked={active}
          onChange={(e) => setMethodActive(e as any)}
        />
        <div className="flex-1">
          <label
            htmlFor="FPS"
            className="flex items-center space-x-4 sm:space-x-6 "
          >
            <p>
              <p className="font-medium">FPS 轉數快:6660 3193</p>
              <br />
              <p className="font-medium" style={{ color: "red" }}>
                **轉帳後請將收據及訂單號 WhatsApp 至 +852-37957455
                <br />
                或電郵到 cot.info813@gmail.com
              </p>
            </p>
          </label>
        </div>
      </div>
    );
  };

  const renderWeChatPay = () => {
    const active = methodActive === "WeChat Pay";
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-5.5"
          name="payment-method"
          id="WeChat Pay"
          defaultChecked={active}
          onChange={(e) => setMethodActive(e as any)}
        />
        <div className="flex-1">
          <label
            htmlFor="WeChat Pay"
            className="flex items-center space-x-4 sm:space-x-6 "
          >
            <p className="font-medium">微信支付 WeChat Pay</p>
          </label>
        </div>
      </div>
    );
  };

  const renderAliPay = () => {
    const active = methodActive === "AliPay";
    return (
      <div className="flex items-start space-x-4 sm:space-x-6">
        <Radio
          className="pt-5.5"
          name="payment-method"
          id="AliPay"
          defaultChecked={active}
          onChange={(e) => setMethodActive(e as any)}
        />
        <div className="flex-1">
          <label
            htmlFor="AliPay"
            className="flex items-center space-x-4 sm:space-x-6 "
          >
            <p className="font-medium">支付宝 Alipay</p>
          </label>
        </div>
      </div>
    );
  };

  const renderPaymentMethod = () => {
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl ">
        <div className="p-6 flex flex-col sm:flex-row items-start">
          <span className="hidden sm:block">
            <svg
              className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.92969 15.8792L15.8797 3.9292"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.1013 18.2791L12.3013 17.0791"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.793 15.5887L16.183 13.1987"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.60127 10.239L10.2413 3.599C12.3613 1.479 13.4213 1.469 15.5213 3.569L20.4313 8.479C22.5313 10.579 22.5213 11.639 20.4013 13.759L13.7613 20.399C11.6413 22.519 10.5813 22.529 8.48127 20.429L3.57127 15.519C1.47127 13.419 1.47127 12.369 3.60127 10.239Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 21.9985H22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="sm:ml-8">
            <h3 className=" text-slate-700 dark:text-slate-400 flex ">
              <span className="uppercase tracking-tight">PAYMENT METHOD</span>
            </h3>
            <div className="font-semibold mt-1 text-sm">
              <span className="">{methodActive}</span>
            </div>
          </div>
          {!isActive ? (
            <ButtonSecondary
              sizeClass="py-2 px-4 "
              fontSize="text-sm font-medium"
              className="bg-slate-50 dark:bg-slate-800 mt-5 sm:mt-0 sm:ml-auto !rounded-lg"
              onClick={onOpenActive}
            >
              Change
            </ButtonSecondary>
          ) : null}
        </div>
        <div
          className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-6 ${
            isActive ? "block" : "hidden"
          }`}
        >
          <div>{renderBankAccount()}</div>
          <div>{renderFPS()}</div>
          {/* <div>{renderWeChatPay()}</div> */}
          {/* <div>{renderAliPay()}</div> */}

          <div className="flex pt-6">
            <ButtonPrimary
              className="sm:!px-7 shadow-none"
              onClick={() => {
                store.dispatch(setPaymentMethod(methodActive));
                onCloseActive();
              }}
            >
              Save
            </ButtonPrimary>
            <ButtonSecondary className="ml-3" onClick={onCloseActive}>
              Cancel
            </ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };

  return renderPaymentMethod();
};

export default PaymentMethod;
