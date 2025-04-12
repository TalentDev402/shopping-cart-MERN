import React from "react";
import { Modal, Form, Input, Flex, Button } from "antd";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryList } from "store/slices/productSlice";
import { RootState } from "store";

interface CategoryModalProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  subCategory: any;
  mode: number;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  setOpen,
  title,
  subCategory,
  mode,
}) => {
  const dispatch = useDispatch();
  const { categoryList } = useSelector((state: RootState) => state.product);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const messageAPI = React.useContext(MessageContext);

  const handleCancel = () => {
    setOpen(false);
  };

  const saveCategory = async (values: any) => {
    try {
      setConfirmLoading(true);
      if (mode === 1) {
        values = { ...values, pos: subCategory.pos };
        const response: any = await apis.AddSubCategory(subCategory.id, values);
        if (response.success) {
          const index = categoryList.findIndex(
            (cat: any) => cat._id === subCategory.id
          );
          const updateCategoryList = [...categoryList];
          updateCategoryList[index] = response.category;
          dispatch(setCategoryList(updateCategoryList));
          messageAPI.open({
            type: "success",
            content: "Product Sub Category created successfully",
          });
        }
      } else if (mode === 0) {
        const response: any = await apis.CreateCategory(values);
        if (response.success) {
          dispatch(setCategoryList([...categoryList, response.category]));
          messageAPI.open({
            type: "success",
            content: "Product Category created successfully",
          });
        }
      } else {
        values = { ...values, pos: subCategory.pos };
        const response: any = await apis.EditCategory(subCategory.id, values);
        if (response.success) {
          const index = categoryList.findIndex(
            (cat: any) => cat._id === subCategory.id
          );
          const updateCategoryList = [...categoryList];
          updateCategoryList[index] = response.category;
          dispatch(setCategoryList(updateCategoryList));
          messageAPI.open({
            type: "success",
            content: "Product category updated successfully",
          });
        }
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
      if (categoryList.length && mode === 2) {
        const filters = categoryList.filter((ca: any) => ca._id === subCategory.id);
        if (filters.length) {
          const filteredCategory = filters[0];
          if (subCategory.pos.length === 0) {
            form.setFieldsValue({
              name: filteredCategory.name
            });
          } else {
            let tempCategory: any = filteredCategory;
            for (let i = 0; i < subCategory.pos.length; i++) {
              tempCategory = tempCategory.subCategory[Number(subCategory.pos[i])]
            }
            form.setFieldsValue({ name: tempCategory.name });
          }
        }
      }
    }
  }, [open, form, categoryList]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={300}
    >
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ width: "100%", marginTop: 20 }}
        onFinish={saveCategory}
        autoComplete="off"
      >
        <Form.Item
          style={{ marginBottom: 8 }}
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please enter category name!",
            },
          ]}
        >
          <Input />
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

export default CategoryModal;
