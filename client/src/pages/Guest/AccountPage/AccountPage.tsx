import Label from "components/Guest/utils/Label/Label";
import { FC, useState, useEffect } from "react";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import Input from "components/Guest/shared/Input/Input";
import Textarea from "components/Guest/shared/Textarea/Textarea";
import CommonLayout from "./CommonLayout";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "store/slices/authSlice";
import { RootState } from "store";
import toast from "react-hot-toast";
import { apis } from "apis";

export interface AccountPageProps {
  className?: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [point, setPoint] = useState(0);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const updateAccount = async () => {
    if (currentUser) {
      const id = currentUser?._id;
      const user = {
        _id: currentUser?._id,
        email: email,
        name: name,
        phone: phonenumber,
        address: address,
        points: point,
      };
      const res: any = await apis.UpdateCustomer(id, user);
      dispatch(setCurrentUser(user));
      if (res.success) {
        toast.error("Updated successfully!");
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      setPoint(currentUser?.points);
      setName(currentUser?.name);
      setEmail(currentUser?.email);
      setAddress(currentUser?.address);
      setPhonenumber(currentUser?.phone);
    }
  }, [currentUser]);

  const onchangeName = (event: any) => {
    setName(event.target.value);
  };

  const onchangeEmail = (event: any) => {
    setEmail(event.target.value);
  };

  const onchangeAddress = (event: any) => {
    setAddress(event.target.value);
  };

  const onchangePhonenumber = (event: any) => {
    setPhonenumber(event.target.value);
  };

  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Account infomation
          </h2>
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex items-start">
              {/* AVATAR */}
              <div className="relative rounded-full overflow-hidden flex">
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="mt-1 text-xs">Change Image</span>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
              <div>
                <Label>Full name</Label>
                <Input
                  className="mt-1.5"
                  onChange={onchangeName}
                  value={name}
                />
              </div>

              {/* ---- */}

              {/* ---- */}
              <div>
                <Label>Email</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-envelope"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    placeholder="example@email.com"
                    onChange={onchangeEmail}
                    value={email}
                  />
                </div>
              </div>

              <div>
                <Label>Addess</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-map-signs"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    onChange={onchangeAddress}
                    value={address}
                  />
                </div>
              </div>

              <div>
                <Label>Phone number</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-phone-volume"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    onChange={onchangePhonenumber}
                    value={phonenumber}
                  />
                </div>
              </div>
              {/* ---- */}
              <div>
                <Label>Point</Label>
                <Input
                  className="mt-1.5"
                  onChange={onchangePhonenumber}
                  value={point}
                  disabled
                />
              </div>
              {/* ---- */}
              <div>
                <Label>About you</Label>
                <Textarea className="mt-1.5" />
              </div>
              <div className="pt-2">
                <ButtonPrimary onClick={updateAccount}>
                  Update account
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPage;
