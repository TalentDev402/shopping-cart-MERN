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
  InputNumber,
  TreeSelect,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { IProduct, ITag } from "utils/types";

interface ProductModalProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  product: IProduct | null;
  mode: "create" | "edit" | "import" | "export";
  refreshList: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  title,
  open,
  product,
  mode,
  setOpen,
  refreshList
}) => {
  const { currency } = useSelector((state: RootState) => state.setting);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [thumbnailList, setThumbnailList] = useState<Array<any>>([]);
  const messageAPI = useContext(MessageContext);
  const { tags, categoryList } = useSelector(
    (state: RootState) => state.product
  );
  const { suppliers } = useSelector((state: RootState) => state.supplier);

  const handleCancel = () => {
    setOpen(false);
  };

  const saveProduct: FormProps["onFinish"] = async (values) => {
    try {
      setConfirmLoading(true);
      if (values.photo && values.photo.fileList.length > 0) {
        const logoFile = values.photo.fileList[0].originFileObj;
        const formData = new FormData();
        formData.append("file", logoFile);
        const uploadResponse: any = await apis.UploadProductPhoto(formData, {
          headers: { "content-type": "multipart/form-data" },
        });

        if (uploadResponse.success) {
          values.photo = uploadResponse.path;
        } else {
          values.photo = undefined;
        }
      }

      let thumbnails: any = []
      if (values.thumbnails) {
        let func: any = [];
        if (values.thumbnails.fileList.length > 0) {
          values.thumbnails.fileList.forEach((file: any) => {
            if (file.status === "done") {
              thumbnails.push(`img/${file.name}`);
            } else {
              const logoFile = file.originFileObj;
              const formData = new FormData();
              formData.append("file", logoFile);
              func.push(apis.UploadProductPhoto(formData, {
                headers: { "content-type": "multipart/form-data" },
              }))
            }
          });

          const results = await Promise.all(func);
          results.forEach((res: any) => {
            thumbnails.push(res.path);
          });
        } else {
          values.thumbnails = []
        }
      } else {
        thumbnails = product?.thumbnails;
      }
      values.thumbnails = thumbnails;
      if (values.category) {
        const positions = values.category.split("-");
        const index = Number(positions[1]);
        const pos = positions.slice(2).map((p: string) => Number(p));
        const id = categoryList.at(index)._id;
        values.category = {
          category: id,
          pos: pos,
        };
      }

      values.currency = currency.currencyList[currency.baseCurrency].name;

      let response: any =
        mode === "create"
          ? await apis.CreateProduct(values)
          : await apis.UpdateProduct(product?._id as string, values);
      if (response.success) {
        refreshList();
      }
      messageAPI.open({
        type: "success",
        content: "Product saved successfully",
      });
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

  const handlePhotoChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setFileList(newFileList);

  const handleThumbnailsChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setThumbnailList(newFileList);

  const CategoryTree = (parentKey: string, subCategory: any) => {
    return subCategory.map((category: any, index: number) => {
      return {
        title: category.name,
        value: `${parentKey}-${index}`,
        children: CategoryTree(`${parentKey}-${index}`, category.subCategory),
      };
    });
  };

  const categoryTreeData = React.useMemo(() => {
    return categoryList.map((category: any, index: number) => {
      return {
        title: category.name,
        value: `0-${index}`,
        children: CategoryTree(`0-${index}`, category.subCategory),
      };
    });
  }, [categoryList]);

  React.useEffect(() => {
    if (open) {
      form.resetFields();
      setFileList([]);
      setThumbnailList([]);
      if (product) {
        if (product.photo) {
          setFileList([
            {
              uid: "-1",
              name: product.photo?.split("/")[1],
              status: "done",
              url: `${process.env.REACT_APP_SERVER_URL}/${product.photo}`,
            },
          ]);
        }

        if (product.thumbnails) {
          setThumbnailList(product.thumbnails.map((thumb: string, index: number) => {
            return {
              uid: index.toString(),
              name: thumb?.split("/")[1],
              status: "done",
              url: `${process.env.REACT_APP_SERVER_URL}/${thumb}`,
            }
          }))
        }

        let category = null;

        if (product.category.category) {
          const index = categoryList.findIndex(
            (c: any) => c._id === product.category.category._id
          );
          category =
            `0-${index}` +
            (product.category.pos.length > 0 ? "-" : "") +
            product.category.pos.join("-");
        }

        form.setFieldsValue({
          itemNo: product.itemNo,
          name: product.name,
          description: product.description,
          quantity: product.quantity,
          alertQuantity: product.alertQuantity,
          supplier: product?.supplier?._id,
          purchasePrice: product.purchasePrice,
          sellingPrice: product.sellingPrice,
          tags: product.tags.map((tag: ITag) => tag._id),
          status: product.status,
          category: category,
        });
      } else {
        setFileList([]);
      }
    }
  }, [open, product, form]);

  return (
    <Modal
      title={<IntlMessage id={title} />}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={570}
    >
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: "100%" }}
        onFinish={saveProduct}
        autoComplete="off"
      >
        <Form.Item
          style={{ marginBottom: 8 }}
          label="Item No"
          name="itemNo"
          rules={[
            {
              required: true,
              message: "Please input item number!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Description"
          name="description"
        >
          <Input.TextArea style={{ height: 150 }} />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Supplier" name="supplier">
          <Select
            style={{ width: "100%" }}
            options={suppliers.map((supplier) => {
              return { value: supplier._id, label: supplier.name };
            })}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Quantity" name="quantity">
          <InputNumber style={{ width: "100%" }} min={0} step="1" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Alert Quantity" name="alertQuantity">
          <InputNumber style={{ width: "100%" }} min={0} step="1" />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Purchase Price"
          name="purchasePrice"
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            addonBefore={
              currency ? currency.currencyList[currency.baseCurrency].name : ""
            }
            addonAfter={
              currency
                ? currency.currencyList[currency.baseCurrency].symbol
                : ""
            }
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Selling Price"
          name="sellingPrice"
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            addonBefore={
              currency ? currency.currencyList[currency.baseCurrency].name : ""
            }
            addonAfter={
              currency
                ? currency.currencyList[currency.baseCurrency].symbol
                : ""
            }
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Tags" name="tags">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            size="large"
            placeholder="Please select tags..."
            options={tags.map((tag) => {
              return { value: tag._id, label: tag.name };
            })}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Category" name="category">
          <TreeSelect
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            treeData={categoryTreeData}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Photo" name="photo">
          <Upload
            beforeUpload={() => false}
            listType="picture-circle"
            maxCount={1}
            showUploadList={{ showPreviewIcon: false }}
            onChange={handlePhotoChange}
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

        <Form.Item style={{ marginBottom: 8 }} label="Thumbnails" name="thumbnails">
          <Upload
            beforeUpload={() => false}
            listType="picture-circle"
            maxCount={10}
            showUploadList={{ showPreviewIcon: false }}
            onChange={handleThumbnailsChange}
            fileList={thumbnailList}
            accept="image/*"
            multiple
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
              <div style={{ marginTop: 8 }}>Upload (Max: 10)</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Status" name="status">
          <Switch />
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

export default ProductModal;
