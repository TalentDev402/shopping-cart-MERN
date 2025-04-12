import React, { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import NcImage from "components/Guest/shared/NcImage/NcImage";
// import LikeButton from "./LikeButton";
import Prices from "./Prices";
// import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
// import { StarIcon } from "@heroicons/react/24/solid";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
// import ButtonSecondary from "components/Guest/shared/Button/ButtonSecondary";
import BagIcon from "./BagIcon";
// import toast from "react-hot-toast";
// import { Transition } from "@headlessui/react";
// import ModalQuickView from "./ModalQuickView";
// import ProductStatus from "./ProductStatus";

export interface ProductCardProps {
  className?: string;
  data?: any;
  isLiked?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  className = "",
  data,
  isLiked,
}) => {
  const {
    _id,
    name,
    sellingPrice,
    description,
    status,
    photo,
  } = data;
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}
        data-nc-id="ProductCard"
      >
        <Link to={`/product/${_id}`} className="absolute inset-0"></Link>

        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
          <Link to={`/product/${_id}`} className="block">
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
              // src={photo ? `http://localhost:5000/${photo}` : undefined}
              src={photo ? `${process.env.REACT_APP_SERVER_URL}/${photo}` : undefined}
              className="object-cover w-full h-full drop-shadow-xl"
            />
          </Link>
        </div>
        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          <div>
            <h2
              className={`nc-ProductCard__title text-base font-semibold transition-colors`}
            >
              {name}
            </h2>
            <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 `}>
              {description ? description.length > 50 ? `${description.substring(0, 50)}...` : description : ""}
            </p>
          </div>

          <div className="flex justify-between items-end ">
            <Prices price={sellingPrice} />
            <ButtonPrimary sizeClass="px-3 py-2" fontSize="text-sm" onClick={() => navigate(`/product/${_id}`)}>
              <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
              <span className="ml-2">Add to cart</span></ButtonPrimary>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
