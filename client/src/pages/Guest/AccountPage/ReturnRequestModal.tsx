import { apis } from "apis";
import { RootState, store } from "store";
import toast from "react-hot-toast";
import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Form, Input, Flex, Button, Radio, Select, type FormProps } from "antd";
import { MessageContext } from "layouts/Admin";
import { setRequest } from "store/slices/requestSlice";

interface ReturnRequestModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setConfirmOpen: (value: boolean) => void;
  loading: boolean;
}

const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  open,
  setOpen,
  setConfirmOpen,
  loading,
}) => {

  const [form] = Form.useForm();
  const { contactInfo } = useSelector((state: RootState) => state.order);
  const { orders } = useSelector((state: RootState) => state.order);
  const { request } = useSelector((state: RootState) => state.request);
  const [requestType, setRequestType] = useState("");
  const messageAPI = useContext(MessageContext);
  const handleClose = () => {
    setOpen(false);
  };

  const sendRequest: FormProps["onFinish"] = async (values) => {
    try {
      let response: any;
      response = await apis.CreateRequest(values)
      handleClose();
      if (response.success) {
        toast.success("Return Request Success!");
        store.dispatch(setRequest(response.request));
        setConfirmOpen(true);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err: any) {
      toast.error("Something went wrong!");
    }
  }

  return (
    <Modal
      title={"Return Request Form"}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
    >
      <Form
        layout="vertical"
        name="退貨申請表"
        form={form}
        style={{ width: "100%", marginTop: 20, padding: 20 }}
        autoComplete="off"
        onFinish={sendRequest}
      >
        <Form.Item
          name="orderNumber"
          label="訂單編號 (例如#1)"
          rules={[
            {
              required: true,
              message: "Please input Order Number",
            }
          ]}
        >
          <Select placeholder="Order Number (for example #1)">
            {orders.map((order) => {
              return <Select.Option key={order.orderId} value={order.orderId}>{order.orderId}</Select.Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="fullName"
          label="您的姓名"
          rules={[
            {
              required: true,
              message: "Please input Full Name",
            }
          ]}
        >
          <Input
            placeholder="Full Name"
          />
        </Form.Item>
        <Form.Item
          name="emailAddress"
          label="電子郵件"
          rules={[
            {
              required: true,
              message: "Please input Email Address",
            },
            {
              type: "email",
              message: "Please enter a validate email!",
            },
          ]}
        >
          <Input
            placeholder="Email Address"
            type="email"
            value={contactInfo.email}
          />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="聯絡電話"
          rules={[
            {
              required: true,
              message: "Please input Phone Number",
            }
          ]}
        >
          <Input
            placeholder="Phone Number"
            value={contactInfo.phone}
          />
        </Form.Item>
        <Form.Item
          name="requestReason"
          label="退貨原因"
          rules={[
            {
              required: true,
              message: "Please select a Return Request Reason",
            }
          ]}
        >
          <Radio.Group
            onChange={(event) => setRequestType(event.target.value)}
            value={requestType}>
            <Radio value={"Defects in the product"}>商品本身瑕疵</Radio>
            <Radio value={"The product shipped does not matched the product ordered"}>寄送商品與訂購商品不符</Radio>
            <Radio value={"others"}>其他(請於下方詳述原因)</Radio>
          </Radio.Group>
        </Form.Item>
        {requestType === "others" ? (
          <Form.Item
            name="otherReason"
            rules={[
              {
                required: true,
                message: "Please input Other Reason",
              }
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        ) : ""}

        <Form.Item
          style={{ marginBottom: 0, marginTop: 15 }}
        >
          <Flex justify="center" gap={10}>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={handleClose} type="primary" htmlType="submit" loading={loading}>
              送出
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReturnRequestModal;