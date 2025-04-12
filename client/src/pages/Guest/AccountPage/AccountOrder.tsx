import React, { useState } from "react";
import Prices from "components/Guest/utils/Prices";
import CommonLayout from "./CommonLayout";
import { useSelector } from "react-redux";
import { RootState } from "store";
import toast from "react-hot-toast";
import { apis } from "apis";
import { store } from "store";
import { setOrders } from "store/slices/orderSlice";
import { IOrder } from "utils/types";
import Badge from "components/Guest/shared/Badge/Badge";
import NoImage from "assets/images/no-image.png";
import ButtonSecondary from "components/Guest/shared/Button/ButtonSecondary";
import ReturnRequestModal from "./ReturnRequestModal";
import ReturnRequestConfirm from "./ReturnRequestComfirm";

const AccountOrder = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { orders } = useSelector((state: RootState) => state.order);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const GetOrderListByCustomer = async () => {
    try {
      const response: any = await apis.GetOrderListbyCustomer();
      if (response.status) {
        store.dispatch(setOrders(response.orders));
      }
    } catch (err: any) {
      toast.error(err.response.data.messsage);
    }
  };

  React.useEffect(() => {
    if (currentUser) {
      GetOrderListByCustomer();
    }
  }, [currentUser]);

  const renderProductItem = (item: any, index: number) => {
    const { quantity, pricePerItem, product } = item;
    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={
              product
                ? `${process.env.REACT_APP_SERVER_URL}/${product.photo}`
                : NoImage
            }
            alt={product ? product.name : "No Image"}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium line-clamp-1">
                  {product ? product.name : "Deleted"}
                </h3>
              </div>
              <Prices className="mt-0.5 ml-2" price={pricePerItem} />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">Qty</span>
              <span className="inline-block sm:hidden">x</span>
              <span className="ml-2">{quantity}</span>
            </p>

            <div className="flex">
              {/* <button
                type="button"
                className="font-medium text-indigo-600 dark:text-primary-500 "
              >
                Leave review
              </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrder = (order: IOrder, index: number) => {
    const orderTrackStatusText = (status: string) => {
      if (status === "ordered") return "Ordered";
      else if (status === "picked_by_courier") return "Picked By Courier";
      else if (status === "on_the_way") return "On the Way";
      else if (status === "ready_for_pickup") return "Ready for Pickup";
      else return "Delivered";
    };

    const orderTrackStatusColor = (status: string) => {
      if (status === "ordered") return "blue";
      else if (status === "picked_by_courier") return "purple";
      else if (status === "on_the_way") return "pink";
      else if (status === "ready_for_pickup") return "indigo";
      else return "green";
    };

    return (
      <div
        className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0"
        key={index}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-semibold">#{order.orderId}</p>
              <Badge
                color={orderTrackStatusColor(order.orderTrackStatus)}
                name={orderTrackStatusText(order.orderTrackStatus)}
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>{new Date(order.createdAt).toLocaleString()}</span>
              {/* <span className="mx-2">·</span> */}
              {/* <span className="text-primary-500">Delivered</span> */}
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            {/* <ButtonSecondary
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"
            >
              View Order
            </ButtonSecondary> */}
            {order.paymentMethod}
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          {order.items.map(renderProductItem)}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 py-3 px-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          <h4 className="text-right font-bold text-xl">
            $
            {order.items
              .reduce(
                (pre: number, cur: any) =>
                  pre + cur.pricePerItem * cur.quantity,
                0
              )
              .toFixed(2)}
          </h4>
        </div>
      </div>
    );
  };

  const handleReturnReq = () => {
    setOpen(true);
  };

  return (
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <div className="flex justify-between">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Order History
            </h2>
            <ButtonSecondary
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"
              onClick={handleReturnReq}
            >
              Return Request
            </ButtonSecondary>
          </div>
          {orders.map((order: IOrder, index: number) => {
            return renderOrder(order, index);
          })}
        </div>
      </CommonLayout>
      <ReturnRequestModal
        open={open}
        setOpen={setOpen}
        setConfirmOpen={setConfirmOpen}
        loading={false}
      />
      <ReturnRequestConfirm open={confirmOpen} setOpen={setConfirmOpen} />
    </div>
  );
};

export default AccountOrder;
