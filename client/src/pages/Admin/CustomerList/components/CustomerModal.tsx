import React, { useState, useContext } from "react";
import {
  Modal,
  Button,
  Flex,
  Form,
  InputNumber,
  type FormProps,
  Input
} from "antd";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setCustomers } from "store/slices/customerSlice";
import { ICustomer } from "utils/types";

interface CustomerModalProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  customer: ICustomer | null;
  mode: "create" | "edit";
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  title,
  open,
  customer,
  mode,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const messageAPI = useContext(MessageContext);
  const { customers } = useSelector((state: RootState) => state.customer);
  const dipsatch = useDispatch();

  const handleCancel = () => {
    setOpen(false);
  };

  const saveCustomer: FormProps["onFinish"] = async (values) => {
    try {
      setConfirmLoading(true);
      let response: any;
      response =
        mode === "create"
          ? await apis.CreateCustomer(values)
          : await apis.UpdateCustomer(customer?._id as string, values);
      if (response.success) {
        const updatedCustomers =
          mode === "create"
            ? [...customers, response.customer]
            : customers.map((u: ICustomer) => {
              if (u._id !== customer?._id) return u;
              else return response.customer;
            });
        dipsatch(setCustomers(updatedCustomers));
      }
      setConfirmLoading(false);
      handleCancel();
    } catch (err: any) {
      setConfirmLoading(false);
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
    }
  };

  React.useEffect(() => {
    if (open) {
      form.resetFields();
      if (customer) {
        form.setFieldsValue({
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          points: customer.points
        });
      }
    }
  }, [open, customer, form]);

  return (
    <Modal
      title={<IntlMessage id={title} />}
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: "100%", marginTop: 20 }}
        onFinish={saveCustomer}
        autoComplete="off"
      >
        <Form.Item
          style={{ marginBottom: 8 }}
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input email!",
            },
            {
              type: "email",
              message: "Please invput valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Password"
          name="password"
          rules={[
            mode === "create"
              ? { required: true, message: "Please input password!" }
              : {},
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Phone"
          name="phone"
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Address"
          name="address"
        >
          <Input />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Points" name="points">
          <InputNumber style={{ width: "100%" }} min={0} step="1" />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 6, span: 18 }}
          style={{ marginBottom: 0, marginTop: 15 }}
        >
          <Flex justify="flex-end" gap={10}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              Save
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomerModal;
