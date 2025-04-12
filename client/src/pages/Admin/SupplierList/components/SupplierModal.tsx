import React, { useState, useContext } from "react";
import {
  Modal,
  Button,
  Flex,
  Form,
  type FormProps,
  type UploadProps,
  Input,
  Select,
  Switch,
  Upload,
  Tabs,
  Radio,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setSuppliers } from "store/slices/supplierSlice";
import { ISupplier } from "utils/types";

interface SupplierModalProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  supplier: ISupplier | null;
  mode: "create" | "edit";
}

const SupplierModal: React.FC<SupplierModalProps> = ({
  title,
  open,
  supplier,
  mode,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [remarkfileList, setRemarkFileList] = useState<Array<any>>([]);
  const messageAPI = useContext(MessageContext);
  const { suppliers } = useSelector((state: RootState) => state.supplier);
  const [remarkType, setRemarkType] = useState("TEXT");
  const [tab, setTab] = useState("basic");
  const dipsatch = useDispatch();

  const handleCancel = () => {
    setOpen(false);
  };

  const saveSupplier: FormProps["onFinish"] = async (values) => {
    try {
      setConfirmLoading(true);
      if (values.logo && values.logo.fileList.length > 0) {
        const logoFile = values.logo.fileList[0].originFileObj;
        const formData = new FormData();
        formData.append("file", logoFile);
        const uploadResponse: any = await apis.UploadLogo(formData, {
          headers: { "content-type": "multipart/form-data" },
        });

        if (uploadResponse.success) {
          values.logo = uploadResponse.path;
        } else {
          values.logo = undefined;
        }
      }

      if (
        values.type === "FILE" &&
        values.content &&
        values.content.fileList &&
        values.content.fileList.length > 0
      ) {
        const file = values.content.fileList[0].originFileObj;
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse: any = await apis.UploadRemarkFile(formData, {
          headers: { "content-type": "multipart/form-data" },
        });

        if (uploadResponse.success) {
          values.content = uploadResponse.path;
        } else {
          values.content = undefined;
        }
      }

      let data = {
        name: values.name,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        businessNumber: values.businessNumber,
        logo: values.logo,
        website: values.website,
        bankInfo: {
          bankName: values.bankName,
          branch: values.branch,
          accountNumber: values.accountNumber,
          accountName: values.accountName,
        },
        address: {
          country: values.country,
          address: values.address,
          zipCode: values.zipCode,
        },
        remarks: { type: values.type, content: values.content },
        status: values.status,
      };

      let response: any;
      response =
        mode === "create"
          ? await apis.CreateSupplier(data)
          : await apis.UpdateSupplier(supplier?._id as string, data);
      if (response.success) {
        const updatedSupplier =
          mode === "create"
            ? [...suppliers, response.supplier]
            : suppliers.map((u: ISupplier) => {
              if (u._id !== supplier?._id) return u;
              else return response.supplier;
            });
        dipsatch(setSuppliers(updatedSupplier));
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

  const handleAvatarChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setFileList(newFileList);

  React.useEffect(() => {
    if (open) {
      form.resetFields();
      setFileList([]);
      if (supplier) {
        if (supplier.logo) {
          setFileList([
            {
              uid: "-1",
              name: supplier.logo?.split("/")[1],
              status: "done",
              url: `${process.env.REACT_APP_SERVER_URL}/${supplier.logo}`,
            },
          ]);
        }
        if (supplier.remarks.type === "FILE") {
          setRemarkFileList([
            {
              uid: "-1",
              name: supplier.remarks.content?.split("/")[1],
              status: "done",
              url: `${process.env.REACT_APP_SERVER_URL}/${supplier.remarks.content}`,
            },
          ]);
        }
        form.setFieldsValue({
          name: supplier.name,
          contactName: supplier.contactName,
          email: supplier.email,
          phone: supplier.phone,
          businessNumber: supplier.businessNumber,
          bankName: supplier.bankInfo?.bankName,
          branch: supplier.bankInfo?.branch,
          accountNumber: supplier.bankInfo?.accountNumber,
          accountName: supplier.bankInfo?.accountName,
          status: supplier.status,
          website: supplier.website,
          type: supplier.remarks.type,
          content: supplier.remarks.content,
          country: supplier.address.country,
          address: supplier.address.address,
          zipCode: supplier.address.zipCode,
        });
        setRemarkType(supplier.remarks.type);
      } else {
        setFileList([]);
        setRemarkFileList([]);
        form.setFieldsValue({ type: "TEXT", country: "China" });
      }
      setTab("basic");
    }
  }, [open, supplier, form]);

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
        style={{ width: "100%" }}
        onFinish={saveSupplier}
        autoComplete="off"
      >
        <Tabs
          style={{ marginTop: 20 }}
          type="card"
          activeKey={tab}
          onChange={(value) => setTab(value)}
          items={[
            {
              label: "Basic Info",
              key: "basic",
              forceRender: true,
              children: (
                <React.Fragment>
                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Business Name"
                    name="name"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Business No"
                    name="businessNumber"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Email"
                    name="email"
                    rules={[
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
                    label="Phone"
                    name="phone"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Contact Name"
                    name="contactName"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Website"
                    name="website"
                  >
                    <Input addonBefore="https://" />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Logo"
                    name="logo"
                  >
                    <Upload
                      beforeUpload={() => false}
                      listType="picture-circle"
                      maxCount={1}
                      showUploadList={{ showPreviewIcon: false }}
                      onChange={handleAvatarChange}
                      fileList={fileList}
                      accept="image/*"
                    >
                      <button
                        style={{
                          border: 0,
                          background: "none",
                          cursor: "pointer",
                        }}
                        type="button"
                      >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </button>
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Status"
                    name="status"
                  >
                    <Switch />
                  </Form.Item>
                </React.Fragment>
              ),
            },
            {
              label: "Address",
              key: "address",
              forceRender: true,
              children: (
                <React.Fragment>
                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Country"
                    name="country"
                  >
                    <Select>
                      <Select.Option value="China">China</Select.Option>
                      <Select.Option value="Hong Kong">Hong Kong</Select.Option>
                      <Select.Option value="Taiwan">Taiwan</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Address"
                    name="address"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Zip Code"
                    name="zipCode"
                  >
                    <Input />
                  </Form.Item>
                </React.Fragment>
              ),
            },
            {
              label: "Bank Info",
              key: "bank",
              forceRender: true,
              children: (
                <React.Fragment>
                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Bank Name"
                    name="bankName"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Branch"
                    name="branch"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Account No"
                    name="accountNumber"
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Account Name"
                    name="accountName"
                  >
                    <Input />
                  </Form.Item>
                </React.Fragment>
              ),
            },
            {
              label: "Remarks",
              key: "remarks",
              forceRender: true,
              children: (
                <React.Fragment>
                  <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Type"
                    name="type"
                  >
                    <Radio.Group
                      onChange={(event) => setRemarkType(event.target.value)}
                      value={remarkType}
                    >
                      <Radio value={"TEXT"}>Text</Radio>
                      <Radio value={"FILE"}>Upload cooperation agreement</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {remarkType === "TEXT" ? (
                    <Form.Item
                      style={{ marginBottom: 8 }}
                      label="Content"
                      name="content"
                    >
                      <Input.TextArea />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      style={{ marginBottom: 8 }}
                      label="Content"
                      name="content"
                    >
                      <Upload
                        beforeUpload={(file) => {
                          setRemarkFileList([file]);
                          return false;
                        }}
                        onRemove={(file) => {
                          const index = remarkfileList.indexOf(file);
                          const newFileList = fileList.slice();
                          newFileList.splice(index, 1);
                          setRemarkFileList(newFileList);
                        }}
                        maxCount={1}
                        fileList={remarkfileList}
                      >
                        <Button icon={<UploadOutlined />}>Select File</Button>
                      </Upload>
                    </Form.Item>
                  )}
                </React.Fragment>
              ),
            },
          ]}
        />

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

export default SupplierModal;
