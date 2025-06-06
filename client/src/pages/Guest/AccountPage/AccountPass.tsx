import Label from "components/Guest/utils/Label/Label";
import React, { useEffect } from "react";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import Input from "components/Guest/shared/Input/Input";
import CommonLayout from "./CommonLayout";

const AccountPass = () => {


  return (
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Update your password
          </h2>
          <div className=" max-w-xl space-y-6">
            <div>
              <Label>Current password</Label>
              <Input type="password" className="mt-1.5" />
            </div>
            <div>
              <Label>New password</Label>
              <Input type="password" className="mt-1.5" />
            </div>
            <div>
              <Label>Confirm password</Label>
              <Input type="password" className="mt-1.5" />
            </div>
            <div className="pt-2">
              <ButtonPrimary>Update password</ButtonPrimary>
            </div>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPass;
