import Label from "components/Guest/utils/Label/Label";
import { FC, useState, useEffect } from "react";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import ButtonSecondary from "components/Guest/shared/Button/ButtonSecondary";
// import Input from "components/Guest/shared/Input/Input";
import { setContactInfo } from "store/slices/orderSlice";
import { useSelector } from "react-redux";
import { RootState, store } from "store";
import { Form, Input } from "antd";

interface Props {
  isActive: boolean;
  onOpenActive: () => void;
  onCloseActive: () => void;
}

const ContactInfo: FC<Props> = ({ isActive, onCloseActive, onOpenActive }) => {
  const { contactInfo } = useSelector((state: RootState) => state.order);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();

  const handleChangePhone = (event: any) => {
    setPhone(event.target.value);
  }

  const handleChangeEmail = (event: any) => {
    setEmail(event.target.value)
  }

  useEffect(() => {
    setEmail(contactInfo.email);
    setPhone(contactInfo.phone);
    form.setFieldsValue({
        email: contactInfo.email,
        phone: contactInfo.phone,
    });
  }, [contactInfo]);

  const renderAccount = () => {
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row items-start p-6 ">
          <span className="hidden sm:block">
            <svg
              className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="sm:ml-8">
            <h3 className=" text-slate-700 dark:text-slate-300 flex ">
              <span className="uppercase tracking-tight">CONTACT INFO</span>
            </h3>
            <div className="font-semibold mt-1 text-sm">
              <span className="">{contactInfo.name}</span>
              <span className="ml-3 tracking-tighter">{contactInfo.phone}</span>
            </div>
          </div>
          {!isActive ?
            <ButtonSecondary
              sizeClass="py-2 px-4 "
              fontSize="text-sm font-medium"
              className="bg-slate-50 dark:bg-slate-800 mt-5 sm:mt-0 sm:ml-auto !rounded-lg"
              onClick={() => onOpenActive()}
            >
              Change
            </ButtonSecondary> : null}
        </div>
        <div
          className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 ${isActive ? "block" : "hidden"
            }`}
        >
          <div className="flex justify-between flex-wrap items-baseline">
            <h3 className="text-lg font-semibold">Contact infomation</h3>
          </div>
          {/* <div className="max-w-lg">
            <Label className="text-sm">Your phone number</Label>
            <Input className="mt-1.5" value={phone} type={"tel"} onChange={handleChangePhone} required/>
          </div>
          <div className="max-w-lg">
            <Label className="text-sm">Email address</Label>
            <Input className="mt-1.5" type={"email"} value={email} onChange={handleChangeEmail} required/>
          </div> */}
          
          <Form
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
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Please enter email!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Phone"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: "Please enter phone!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
          {/* ============ */}
          <div className="flex flex-col sm:flex-row pt-6">
            <ButtonPrimary
              className="sm:!px-7 shadow-none"
              onClick={() => {
                setPhone(form.getFieldValue("phone"));
                setEmail(form.getFieldValue("email"));
                store.dispatch(setContactInfo({
                  ...contactInfo,
                  phone: form.getFieldValue("phone"),
                  email: form.getFieldValue("email")
                }));
                onCloseActive()
              }}
            >
              Save
            </ButtonPrimary>
            <ButtonSecondary
              className="mt-3 sm:mt-0 sm:ml-3"
              onClick={() => onCloseActive()}
            >
              Cancel
            </ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };

  return renderAccount();
};

export default ContactInfo;
