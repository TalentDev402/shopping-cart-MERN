import React from "react";
import { useDispatch } from "react-redux";
import { Modal, Form, Input, Flex, Button } from "antd";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { setCurrency } from "store/slices/settingSlice";

interface ICurrencyModal {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CurrencyModal: React.FC<ICurrencyModal> = ({ title, open, setOpen }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const messageAPI = React.useContext(MessageContext);

  const handleClose = () => {
    setOpen(false);
  };

  const saveCurrency = async (values: any) => {
    try {
      setConfirmLoading(true);
      const response: any = await apis.CreateCurrency(values);
      if (response.success) {
        dispatch(setCurrency(response.currency));
        messageAPI.open({
          type: "success",
          content: "Currency created successfully",
        });
      }
      setConfirmLoading(false);
      setOpen(false);
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
    }
  }, [open]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={300}
    >
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: "100%", marginTop: 20 }}
        onFinish={saveCurrency}
        autoComplete="off"
      >
        <Form.Item
          style={{ marginBottom: 8 }}
          label="Currency"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter currency!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Symbol"
          name="symbol"
          rules={[
            {
              required: true,
              message: "Please enter symbol!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 8, span: 16 }}
          style={{ marginBottom: 0, marginTop: 15 }}
        >
          <Flex justify="flex-end" gap={10}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              Save
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CurrencyModal;
