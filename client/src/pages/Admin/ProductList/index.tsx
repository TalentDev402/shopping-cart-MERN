import React from "react";
import {
  Flex,
  Typography,
  Button,
  Card,
  Table,
  Image,
  Tooltip,
  Tag,
  Input,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import ProductModal from "./components/ProductModal";
import { MessageContext } from "layouts/Admin";
import { setProducts, setTags } from "store/slices/productSlice";
import { setCategoryList } from "store/slices/productSlice";
import { setSuppliers } from "store/slices/supplierSlice";
import { apis } from "apis";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import NoImage from "assets/images/no-image.png";
import DeleteModal from "components/Admin/Util-components/DeleteModal";
import ProductView from "./components/ProductView";
import ProductImport from "./components/ProductImport";
import ProductExport from "./components/ProductExport";

const ProductList = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { categoryList, products } = useSelector(
    (state: RootState) => state.product
  );
  const messageAPI = React.useContext(MessageContext);
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<
    "create" | "edit" | "import" | "export"
  >("create");
  const [currentProduct, setCurrentProduct] = React.useState<any>(null);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [openImport, setOpenImport] = React.useState(false);
  const [openExport, setOpenExport] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState<any>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = React.useState("");
  const [openView, setOpenView] = React.useState<any>(null);

  const DeleteProduct = async () => {
    try {
      setConfirmLoading(true);
      const id = currentProduct?._id as string;
      const response: any = await apis.DeleteProduct(id);
      if (response.success) {
        messageAPI.open({
          type: "success",
          content: "Product has been deleted successfully",
        });

        const updatedProducs = products.filter(
          (product: any) => product._id !== id
        );
        dispatch(setProducts(updatedProducs));
      }
      setConfirmLoading(false);
      setOpenDeleteModal(false);
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
    }
  };

  const GetTagList = async () => {
    try {
      const response: any = await apis.GetTagList();
      if (response.success) {
        dispatch(setTags(response.tags));
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
    }
  };

  const GetSupplierList = async () => {
    try {
      const response: any = await apis.GetSupplierList();
      if (response.success) {
        dispatch(setSuppliers(response.suppliers));
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
    }
  };

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

  const GetProductList = async () => {
    try {
      setLoading(true);
      dispatch(setProducts([]));
      const response: any = await apis.GetProductList({
        current: pagination.current,
        pageSize: pagination.pageSize,
        search: search,
      });
      if (response.success) {
        dispatch(setProducts(response.products));
        setPagination({
          ...pagination,
          total: response.total,
        });
      }
      setLoading(false);
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    GetTagList();
    GetCategoryList();
    GetSupplierList();
  }, []);

  React.useEffect(() => {
    GetProductList();
  }, [pagination.current, pagination.pageSize]);

  const subCategory = (arr: any, indices: any) => {
    const result: any[] = [];
    indices.reduce((acc: any, curr: any) => {
      result.push(acc[curr].name);
      if (acc[curr].subCategory) return acc[curr].subCategory;
      else return [];
    }, arr);
    return result.join(" -> ");
  };

  const ShowCategory = (category: any) => {
    if (category && category.category && categoryList.length > 0) {
      const currentCategory = categoryList.filter(
        (cat: any) => cat._id === category.category._id
      )[0];

      if (currentCategory && currentCategory.subCategory) {
        const res = subCategory(currentCategory.subCategory, category.pos);
        return (
          currentCategory.name + (category.pos.length > 0 ? " -> " : "") + res
        );
      } else return "";
    } else return "";
  };

  const tableColumns = [
    {
      title: "Item No",
      dataIndex: "itemNo",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Descripiton",
      dataIndex: "description",
      render: (description: string) => (
        <Typography.Paragraph
          style={{ margin: 0, fontSize: 13, whiteSpace: "pre-wrap" }}
        >
          {description}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Alert Quantity",
      dataIndex: "alertQuantity",
    },
    {
      title: "Photo",
      dataIndex: "photo",
      render: (photo: string) => (
        <Image
          width={80}
          src={photo ? `${process.env.REACT_APP_SERVER_URL}/${photo}` : NoImage}
        />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category: any) => ShowCategory(category),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render: (tags: any) =>
        tags.map((tag: any, index: number) => (
          <Tag key={index}>{tag.name}</Tag>
        )),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: boolean) => (
        <Tag className="text-capitalize" color={status ? "cyan" : "red"}>
          {status ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_: any, elm: any) => (
        <Flex gap={5} justify="flex-end">
          <Tooltip title="View">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentProduct(elm);
                setOpenView(true);
              }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentProduct(elm);
                setMode("edit");
                setOpen(true);
              }}
              size="small"
            />
          </Tooltip>
          {currentUser?.role === "SUPER_ADMIN" ? (
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setCurrentProduct(elm);
                  setConfirmLoading(false);
                  setOpenDeleteModal(true);
                }}
                size="small"
              />
            </Tooltip>
          ) : null}
        </Flex>
      ),
    },
  ];

  const handleTableChange = (change: any) => {
    setPagination(change);
  };

  return (
    <React.Fragment>
      <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
        <Typography.Title style={{ fontSize: 30, margin: 0 }}>
          <IntlMessage id={"product.management"} />
        </Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setCurrentProduct(null);
            setMode("create");
            setOpen(true);
          }}
        >
          <IntlMessage id={"product.create-product"} />
        </Button>
      </Flex>
      <Card style={{ padding: "0px" }}>
        <Flex gap={10} style={{ marginBottom: 10 }} justify="space-between">
          <Flex gap={10} style={{ marginBottom: 10 }}>
            <Input
              style={{ width: 300 }}
              value={search}
              onChange={(event: any) => setSearch(event.target.value)}
              placeholder="Search..."
              onKeyDown={(event: any) => {
                if (event.keyCode === 13) {
                  setPagination({
                    ...pagination,
                    current: 1,
                  });
                  GetProductList();
                }
              }}
            />
            <Button
              icon={<SearchOutlined />}
              onClick={() => {
                setPagination({
                  ...pagination,
                  current: 1,
                });
                GetProductList();
              }}
            />
          </Flex>
          <Flex gap={10} style={{ marginBottom: 10, marginLeft: 10 }}>
            <Button
              type="primary"
              onClick={() => {
                setCurrentProduct(null);
                setMode("import");
                setOpenImport(true);
              }}
            >
              <IntlMessage id={"product.import"} />
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setCurrentProduct(null);
                setMode("export");
                setOpenExport(true);
              }}
            >
              <IntlMessage id={"product.export"} />
            </Button>
          </Flex>
        </Flex>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={products}
            rowKey="_id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </div>
      </Card>
      <ProductModal
        open={open}
        mode={mode}
        refreshList={GetProductList}
        setOpen={setOpen}
        title={mode === "create" ? "Create Product" : "Edit Product"}
        product={currentProduct}
      />
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        loading={confirmLoading}
        handleOk={DeleteProduct}
      />
      <ProductView
        open={openView}
        setOpen={setOpenView}
        product={currentProduct}
      />
      <ProductImport
        open={openImport}
        setOpen={setOpenImport}
        refreshList={GetProductList}
      />
      <ProductExport
        open={openExport}
        setOpen={setOpenExport}
        product={currentProduct}
        refreshList={GetProductList}
      />
    </React.Fragment>
  );
};

export default ProductList;
