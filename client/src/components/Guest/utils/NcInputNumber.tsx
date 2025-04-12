import { FC, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { apis } from "apis";
import { store } from "store";
import { setCart } from "store/slices/cartSlice";

export interface NcInputNumberProps {
  productId?: string,
  className?: string;
  defaultValue: number;
  isDispatch?: boolean;
  onChange?: (value: number) => void,
  min?: number;
  max?: number;
  label?: string;
  desc?: string;
  quantity?: number;
}

const NcInputNumber: FC<NcInputNumberProps> = ({
  productId,
  className = "w-full",
  min = 0,
  max = 99,
  onChange,
  defaultValue = 0,
  isDispatch,
  label,
  desc,
  quantity
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleClickDecrement = async () => {
    if (min >= value) return;
    if (isDispatch) {
      try {
        const response: any = await apis.ChangeQuantity({ productId: productId, quantity: value - 1 });
        if (response.success) {
          store.dispatch(setCart(response.cart));
          setValue(value - 1);
        }
      } catch (err: any) {
        toast.error(err.response.data.message);
      }
    } else {
      setValue(value - 1);
      if (onChange) onChange(value - 1);
    }
  };
  const handleClickIncrement = async () => {
    if (max && max <= value) return;
    if (isDispatch) {
      try {
        if (quantity !== undefined && quantity <= value) {
          toast.error("Inventory quantity is insufficient.");
          return;
        }
        const response: any = await apis.ChangeQuantity({ productId: productId, quantity: value + 1 });
        if (response.success) {
          store.dispatch(setCart(response.cart));
          setValue(value + 1);
        }
      } catch (err: any) {
        toast.error(err.response.data.message);
      }
    } else {
      if (quantity !== undefined && quantity <= value) {
        toast.error("Inventory quantity is insufficient.");
        return;
      }
      setValue(value + 1);
      if (onChange) onChange(value + 1);
    }
  };

  const renderLabel = () => {
    return (
      <div className="flex flex-col">
        <span className="font-medium text-neutral-800 dark:text-neutral-200">
          {label}
        </span>
        {desc && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
            {desc}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`nc-NcInputNumber flex items-center justify-between space-x-5 ${className}`}
    >
      {label && renderLabel()}

      <div
        className={`nc-NcInputNumber__content flex items-center justify-between w-[104px] sm:w-28`}
      >
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 dark:hover:border-neutral-400 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickDecrement}
          disabled={min >= value}
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span className="select-none block flex-1 text-center leading-none">
          {value}
        </span>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 dark:hover:border-neutral-400 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
          type="button"
          onClick={handleClickIncrement}
          disabled={max ? max <= value : false}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NcInputNumber;
