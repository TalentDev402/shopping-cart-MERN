import { apis } from "apis";
import { RootState, store } from "store";
import toast from "react-hot-toast";
import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Form, Flex, Button, type FormProps } from "antd";
import { MessageContext } from "layouts/Admin";
import { setRequest } from "store/slices/requestSlice";

interface ReturnRequestConfirmProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ReturnRequestConfirm: React.FC<ReturnRequestConfirmProps> = ({
  open,
  setOpen,
}) => {

  const [form] = Form.useForm();
  const { request } = useSelector((state: RootState) => state.request);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={"退貨申請確認"}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      您的申請已送出，客服人員將會儘快與您聯絡。
      <div>
        申請編號: {request?.requestId}
      </div>
      <div>
        訂單編號 {request?.order.orderId}
      </div>
      <div>
        退貨原因: {request?.returnReason}
      </div>
      <div>
        申請日期: {request?.createdAt.slice(0, 10)}
      </div>
      <div>
        狀態: {request?.status}
      </div>
    </Modal>
  );
};

export default ReturnRequestConfirm;