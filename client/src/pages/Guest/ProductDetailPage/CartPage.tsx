// import { NoSymbolIcon, CheckIcon } from "@heroicons/react/24/outline";
import NcInputNumber from "components/Guest/utils/NcInputNumber";
import Prices from "components/Guest/utils/Prices";
import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import { useSelector } from "react-redux";
import { RootState, store } from "store";
import { apis } from "apis";
import toast from "react-hot-toast";
import { setCart } from "store/slices/cartSlice";
import { useEffect, useState } from "react";
import { SPECIAL_SHIPPING_AREA } from "utils/constants";

const CartPage = () => {
  const navigate = useNavigate();
  const [shippingFee, setShippingFee] = useState(0);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { shippingAddress } = useSelector((state: RootState) => state.order);
  const { cart } = useSelector((state: RootState) => state.cart);

  const checkout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
    } else {
      navigate("/checkout");
    }
  }

  const isSpecialShippingArea = (address: string, area: string[]) => {
    return area.some(subArea => address.replace(" ", "").toLowerCase().includes(subArea.replace(" ", "").toLowerCase()));
  };

  useEffect(() => {
    const temp = cart.reduce((pre: number, cur: any) => pre + cur.product.sellingPrice * cur.quantity, 0);
    const address = shippingAddress?.replace(" ", "").toLowerCase() || "";

    if (isSpecialShippingArea(address, SPECIAL_SHIPPING_AREA[0])) {
      setShippingFee(temp < 400 ? 80 : 0);
    } else if (isSpecialShippingArea(address, SPECIAL_SHIPPING_AREA[1])) {
      setShippingFee(temp < 1400 ? 150 : 0);
    } else {
      setShippingFee(temp < 300 ? 60 : 0);
    }
  }, [cart, shippingAddress]);
  // const renderStatusSoldout = () => {
  //   return (
  //     <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
  //       <NoSymbolIcon className="w-3.5 h-3.5" />
  //       <span className="ml-1 leading-none">Sold Out</span>
  //     </div>
  //   );
  // };

  // const renderStatusInstock = () => {
  //   return (
  //     <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
  //       <CheckIcon className="w-3.5 h-3.5" />
  //       <span className="ml-1 leading-none">In Stock</span>
  //     </div>
  //   );
  // };

  const renderProduct = (item: any, index: number) => {
    const { _id, photo, sellingPrice, name, description, quantity } = item.product;

    const removeItem = async () => {
      try {
        const response: any = await apis.RemoveItem({ productId: _id });
        store.dispatch(setCart(response.cart));
        toast.success("An item has been removed.");
      } catch (err: any) {
        toast.error(err.response.data.message);
      }
    }

    return (
      <div
        key={index}
        className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
      >
        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={process.env.REACT_APP_SERVER_URL + "/" + photo}
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
                  {/* <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.35 1.94995L9.69 3.28992"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.07 11.92L17.19 11.26"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 22H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{`Black`}</span>
                  </div> */}
                  {/* <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span> */}
                  {/* <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 9V3H15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 15V21H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 3L13.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 13.5L3 21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{`2XL`}</span>
                  </div> */}
                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  <div className="text-center relative">
                    <NcInputNumber className="relative z-10" defaultValue={item.quantity} productId={_id} isDispatch={true} quantity={quantity} />
                    <div className="text-sm mt-2">
                      <span className="font-bold">Quantity:&nbsp;</span> {quantity}
                    </div>
                  </div>
                  <div>
                    <Prices
                      contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                      price={sellingPrice}
                    />
                  </div>
                </div>
              </div>

              <div className="hidden sm:block text-center relative">
                <NcInputNumber className="relative z-10" defaultValue={item.quantity} productId={_id} isDispatch={true} quantity={quantity} />
                <div className="text-sm mt-2">
                  <span className="font-bold">Quantity:&nbsp;</span> {quantity}
                </div>
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

  return (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-8">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Shopping Cart
          </h2>
        </div>

        <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />

        <div className="flex flex-col lg:flex-row">

          <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
            {cart.length > 0 ? cart.map(renderProduct) : <h3 className="text-center text-3xl">Cart is empty</h3>}
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="sticky top-28">
              <h3 className="text-lg font-semibold ">Order Summary</h3>
              <div className="mt-7 text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80">
                <div className="flex justify-between pb-4">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    ${cart.reduce((pre: number, cur: any) => pre + cur.product.sellingPrice * cur.quantity, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Shpping estimate</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    ${shippingFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Tax estimate</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    $0.00
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                  <span>Order total</span>
                  <span>${(cart.reduce((pre: number, cur: any) => pre + cur.product.sellingPrice * cur.quantity, 0) + shippingFee).toFixed(2)}</span>
                </div>
              </div>
              <ButtonPrimary className="mt-8 w-full" onClick={checkout}>
                Checkout
              </ButtonPrimary>
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
                  <a
                    // target="_blank"
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
        </div>
      </main>
    </div>
  );
};

export default CartPage;
