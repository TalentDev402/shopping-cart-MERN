import React from "react";
import Header from "components/Guest/utils/Header/Header";
import { useSelector } from "react-redux";
import { setCart } from "store/slices/cartSlice";
import { RootState } from "store";
import toast from "react-hot-toast";
import { apis } from "apis";
import { store } from "store";

const SiteHeader = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const GetCart = async () => {
    try {
      const response: any = await apis.GetCart();
      store.dispatch(setCart(response.cart));
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  }

  React.useEffect(() => {
    if (currentUser) {
      GetCart();
    }
  }, [currentUser])
  
  return <Header />
};

export default SiteHeader;
