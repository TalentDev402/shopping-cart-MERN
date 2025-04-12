import React from "react";
import { Card, Typography, Tree, Button, Divider, Flex } from "antd";
import type { TreeProps } from "antd";
import { DownOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import CategoryModal from "./CategoryModal";
import { setCategoryList } from "store/slices/productSlice";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import DeleteModal from "components/Admin/Util-components/DeleteModal";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categoryList } = useSelector((state: RootState) => state.product);
  const [currentKey, setCurrentKey] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<number>(0);
  const messageAPI = React.useContext(MessageContext);
  const [subCategory, setSubCategory] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

  const onSelect: TreeProps["onSelect"] = (selectedKeys) => {
    if (selectedKeys.length) {
      setCurrentKey(selectedKeys[0].toString().substring(2));
    } else {
      setCurrentKey(null);
    }
  };

  const AddSubCategory = () => {
    if (currentKey !== null) {
      const index = Number(currentKey.substring(0, 1));
      const pos = currentKey
        .substring(2)
        .split("-")
        .filter((cat: string) => cat !== "-" && cat !== "");
      const categoryId = categoryList.at(index)._id;
      setSubCategory({ id: categoryId, pos: pos });
      setMode(1);
      setOpen(true);
    }
  };

  const EditCategory = () => {
    if (currentKey !== null) {
      const index = Number(currentKey.substring(0, 1));
      const pos = currentKey
        .substring(2)
        .split("-")
        .filter((cat: string) => cat !== "-" && cat !== "");
      const categoryId = categoryList.at(index)._id;
      setSubCategory({ id: categoryId, pos: pos });
      setMode(2);
      setOpen(true);
    }
  }

  const GetCategoryList = async () => {
    try {
      const response: any = await apis.GetCategoryList();
      if (response.success) {
        dispatch(setCategoryList(response.categoryList));
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
    }
  };

  const DeleteCategory = async () => {
    try {
      setLoading(true);
      if (currentKey !== null) {
        const index = Number(currentKey.substring(0, 1));
        const pos = currentKey
          .substring(2)
          .split("-")
          .filter((cat: string) => cat !== "-" && cat !== "");
        const categoryId = categoryList.at(index)._id;
        const category = pos.join(",");
        const response: any = await apis.DeleteCategory(categoryId, category);
        if (response.success) {
          if (category === "") {
            const updatedCategoryList = categoryList.filter(
              (ca: any) => ca._id !== categoryId
            );
            dispatch(setCategoryList(updatedCategoryList));
          } else {
            const index = categoryList.findIndex(
              (cat: any) => cat._id === categoryId
            );
            const updateCategoryList = [...categoryList];
            updateCategoryList[index] = response.category;
            dispatch(setCategoryList(updateCategoryList));
          }
          setCurrentKey(null);
          messageAPI.open({
            type: "success",
            content: "Product Category deleted successfully",
          });
        }
      }
      setLoading(false);
      setOpenDeleteModal(false);
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    GetCategoryList();
  }, []);

  const CategoryTree = (parentKey: string, subCategory: any) => {
    return subCategory.map((category: any, index: number) => {
      return {
        title: category.name,
        key: `${parentKey}-${index}`,
        children: CategoryTree(`${parentKey}-${index}`, category.subCategory),
      };
    });
  };

  const categoryTreeData = React.useMemo(() => {
    return categoryList.map((category: any, index: number) => {
      return {
        title: category.name,
        key: `0-${index}`,
        children: CategoryTree(`0-${index}`, category.subCategory),
      };
    });
  }, [categoryList]);

  return (
    <Card style={{ padding: 0 }}>
      <Typography.Title level={3}>
        <IntlMessage id={"product.category.list"} />
      </Typography.Title>
      <Flex align="center" gap={10} wrap="wrap">
        <Button
          icon={<PlusOutlined />}
          size="small"
          onClick={() => {
            setMode(0);
            setOpen(true);
          }}
        >
          New Category
        </Button>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={AddSubCategory}
          disabled={currentKey === null}
        >
          Add Sub-category
        </Button>
        <Button
          type="primary"
          ghost
          icon={<EditOutlined />}
          size="small"
          disabled={currentKey === null}
          onClick={EditCategory}
        >
          Edit Category
        </Button>
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          disabled={currentKey === null}
          onClick={() => {
            setLoading(false);
            setOpenDeleteModal(true);
          }}
        >
          Delete Category
        </Button>
      </Flex>
      <Divider style={{ marginBottom: 10, marginTop: 10 }} />
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        onSelect={onSelect}
        style={{ fontSize: 15 }}
        treeData={categoryTreeData}
      />
      <CategoryModal
        title={mode === 1 ? "Add Sub Category" : mode === 0 ? "Create Category" : "Edit Category"}
        open={open}
        mode={mode}
        setOpen={setOpen}
        subCategory={subCategory}
      />
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        handleOk={DeleteCategory}
        loading={loading}
      />
    </Card>
  );
};

export default CategoryList;
