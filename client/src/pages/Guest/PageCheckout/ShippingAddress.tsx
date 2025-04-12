import Label from "components/Guest/utils/Label/Label";
import { FC, useEffect, useState } from "react";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import ButtonSecondary from "components/Guest/shared/Button/ButtonSecondary";
// import Input from "components/Guest/shared/Input/Input";
import { useSelector } from "react-redux";
import { RootState, store } from "store";
import { setShippingAddress } from "store/slices/orderSlice";
import { Form, Input } from "antd";
// import Radio from "components/Guest/shared/Radio/Radio";
// import Select from "components/Guest/shared/Select/Select";

interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
}

const ShippingAddress: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
}) => {
  const { shippingAddress } = useSelector((state: RootState) => state.order);
  const [address, setAddress] = useState("");
  const [form] = Form.useForm();

  const handleChangeAddress = (event: any) => {
    setAddress(event.target.value);
  }

  useEffect(() => {
    setAddress(shippingAddress);
    form.setFieldsValue({
        address: shippingAddress,
    });
  }, [shippingAddress]);
  const renderShippingAddress = () => {
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
                d="M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.14008 6.75L5.34009 8.55L7.14008 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.8601 6.75L18.6601 8.55L16.8601 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className="sm:ml-8">
            <h3 className=" text-slate-700 dark:text-slate-300 flex ">
              <span className="uppercase">SHIPPING ADDRESS</span>
            </h3>
            <div className="font-semibold mt-1 text-sm">
              <span className="">
                {shippingAddress}
              </span>
            </div>
          </div>
          {!isActive ?
            <ButtonSecondary
              sizeClass="py-2 px-4 "
              fontSize="text-sm font-medium"
              className="bg-slate-50 dark:bg-slate-800 mt-5 sm:mt-0 sm:ml-auto !rounded-lg"
              onClick={onOpenActive}
            >
              Change
            </ButtonSecondary> : null}
        </div>
        <div
          className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 ${isActive ? "block" : "hidden"
            }`}
        >
          {/* <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-3">
            <div className="flex-1">
              <Label className="text-sm">Address</Label>
              <Input
                className="mt-1.5"
                placeholder=""
                type={"text"}
                onChange={handleChangeAddress}
                value={address}
                required
              />
            </div>
          </div> */}<Form
                name="contact"
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ width: "100%", marginTop: 20 }}
                // onFinish={saveContactInfo}
                autoComplete="off"
            >
                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Address"
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: "Please enter address!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>

          <div className="flex flex-col sm:flex-row pt-6">
            <ButtonPrimary
              className="sm:!px-7 shadow-none"
              onClick={() => {
                setAddress(form.getFieldValue("address"));
                store.dispatch(setShippingAddress(form.getFieldValue("address")));
                onCloseActive()
              }}
            >
              Save
            </ButtonPrimary>
            <ButtonSecondary
              className="mt-3 sm:mt-0 sm:ml-3"
              onClick={onCloseActive}
            >
              Cancel
            </ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };
  return renderShippingAddress();
};

export default ShippingAddress;
