import NcInputNumber from "components/Guest/utils/NcInputNumber";
import Prices from "components/Guest/utils/Prices";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import { useSelector } from "react-redux";
import ShippingAddress from "./ShippingAddress";
import { RootState, store } from "store";
import toast from "react-hot-toast";
import { setCart } from "store/slices/cartSlice";
import {
  setShippingAddress,
  setPaymentMethod,
  setContactInfo,
} from "store/slices/orderSlice";
import { apis } from "apis";
import { SPECIAL_SHIPPING_AREA } from "utils/constants";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useSelector((state: RootState) => state.cart);
  const [shippingFee, setShippingFee] = useState(0);
  const { contactInfo, paymentMethod, shippingAddress } = useSelector(
    (state: RootState) => state.order
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [contactInfoStatus, setContactInfoStatus] = useState(false);
  const [shippingAddressStatus, setShippingAddressStatus] = useState(false);
  const [paymentMethodStatus, setPaymentMethodStatus] = useState(false);

  const CreateOrder = async () => {
    const items = cart
      .filter((one) => one.quantity !== 0)
      .map((one) => {
        return {
          product: one.product._id,
          quantity: one.quantity,
          pricePerItem: one.product.sellingPrice,
        };
      });
    if (items.length > 0) {
      try {
        const response: any = await apis.CreateOrder({
          items,
          fee: shippingFee,
          contactInfo: {
            phone: contactInfo.phone,
            email: contactInfo.email,
          },
          paymentMethod,
          shippingAddress,
        });
        if (response.success) {
          navigate("/account/order");
          store.dispatch(setCart([]));
        }
      } catch (err: any) {
        toast.error(err.response.data.messsage);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      store.dispatch(
        setContactInfo({
          name: currentUser.name,
          phone: currentUser.phone || "",
          email: currentUser.email,
        })
      );
      store.dispatch(setShippingAddress(currentUser.address || ""));
      store.dispatch(setPaymentMethod("Transfer via bank account"));
    }
  }, [currentUser]);

  const isSpecialShippingArea = (address: string, area: string[]) => {
    return area.some((subArea) =>
      address
        .replace(" ", "")
        .toLowerCase()
        .includes(subArea.replace(" ", "").toLowerCase())
    );
  };

  useEffect(() => {
    const temp = cart.reduce(
      (pre: number, cur: any) => pre + cur.product.sellingPrice * cur.quantity,
      0
    );
    const address = shippingAddress?.replace(" ", "").toLowerCase() || "";

    if (isSpecialShippingArea(address, SPECIAL_SHIPPING_AREA[0])) {
      setShippingFee(temp < 400 ? 80 : 0);
    } else if (isSpecialShippingArea(address, SPECIAL_SHIPPING_AREA[1])) {
      setShippingFee(temp < 1400 ? 150 : 0);
    } else {
      setShippingFee(temp < 300 ? 60 : 0);
    }
  }, [cart, shippingAddress]);

  const renderProduct = (item: any, index: number) => {
    const { _id, photo, sellingPrice, name, description } = item.product;

    const removeItem = async () => {
      try {
        const response: any = await apis.RemoveItem({ productId: _id });
        store.dispatch(setCart(response.cart));
        toast.success("An item has been removed.");
      } catch (err: any) {
        toast.error(err.response.data.message);
      }
    };

    return (
      <div
        key={index}
        className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
      >
        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={`${process.env.REACT_APP_SERVER_URL}/` + photo}
            alt={name}
            className="h-full w-full object-contain object-center"
          />
          <Link to={`/product/${_id}`} className="absolute inset-0"></Link>
        </div>
        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  <Link to={`/product/${_id}`}>{name}</Link>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <p>{description}</p>
                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  <div className="text-center relative">
                    <NcInputNumber
                      className="relative z-10"
                      defaultValue={item.quantity}
                      productId={_id}
                      isDispatch={true}
                    />
                  </div>
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={sellingPrice}
                  />
                </div>
              </div>

              <div className="hidden sm:block text-center relative">
                <NcInputNumber
                  className="relative z-10"
                  defaultValue={item.quantity}
                  productId={_id}
                  isDispatch={true}
                />
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={sellingPrice} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-end text-sm">
            {/* {Math.random() > 0.6
              ? renderStatusSoldout()
              : renderStatusInstock()} */}

            <a
              href="#"
              onClick={removeItem}
              className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm "
            >
              <span>Remove</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div className="scroll-mt-24">
          <ContactInfo
            isActive={contactInfoStatus}
            onOpenActive={() => {
              setContactInfoStatus(true);
            }}
            onCloseActive={() => {
              setContactInfoStatus(false);
            }}
          />
        </div>

        <div className="scroll-mt-24">
          <ShippingAddress
            isActive={shippingAddressStatus}
            onOpenActive={() => {
              setShippingAddressStatus(true);
            }}
            onCloseActive={() => {
              setShippingAddressStatus(false);
            }}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            isActive={paymentMethodStatus}
            onOpenActive={() => {
              setPaymentMethodStatus(true);
            }}
            onCloseActive={() => {
              setPaymentMethodStatus(false);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Checkout
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold">Order summary</h3>
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">
              {cart.map(renderProduct)}
            </div>

            <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 ">
              {/* <div>
                <Label className="text-sm">Discount code</Label>
                <div className="flex mt-1.5">
                  <Input sizeClass="h-10 px-4 py-3" className="flex-1" />
                  <button className="text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-200/70 dark:bg-neutral-700 dark:hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors">
                    Apply
                  </button>
                </div>
              </div> */}

              <div className="mt-4 flex justify-between py-2.5">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  $
                  {cart
                    .reduce(
                      (pre: number, cur: any) =>
                        pre + cur.product.sellingPrice * cur.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>Shipping estimate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  ${shippingFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>Tax estimate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  $0.00
                </span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>Order total</span>
                <span>
                  $
                  {(
                    cart.reduce(
                      (pre: number, cur: any) =>
                        pre + cur.product.sellingPrice * cur.quantity,
                      0
                    ) + shippingFee
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            {/* {paymentMethod === "PayPal" ?
              <div className="mt-2">{(cart && cart.length !== 0) ?
                
              </div>
              : */}
            <ButtonPrimary onClick={CreateOrder} className="mt-8 w-full">
              Confirm order
            </ButtonPrimary>
            {/* } */}
            <div className="mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
              <p className="block relative pl-5">
                <svg
                  className="w-4 h-4 absolute -left-1 top-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9945 16H12.0035"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Learn more{` `}
                {/* <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="##"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Taxes
                </a>
                <span>
                  {` `}and{` `}
                </span> */}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.cotlife.com/delivery-methods"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Shipping
                </a>
                {` `} infomation
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
