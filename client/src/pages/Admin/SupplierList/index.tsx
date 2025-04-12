import React, { useContext } from "react";
import {
  Card,
  Table,
  Tag,
  Tooltip,
  Button,
  Typography,
  Flex,
  Image,
} from "antd";
import { DeleteOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { ISupplier } from "utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { MessageContext } from "layouts/Admin";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import SupplierModal from "./components/SupplierModal";
import SupplierView from "./components/SupplierView";
import { apis } from "apis";
import { setSuppliers } from "store/slices/supplierSlice";
import NoImage from "assets/images/no-image.png";
import DeleteModal from "components/Admin/Util-components/DeleteModal";

const SupplierList = () => {
  const messageAPI = useContext(MessageContext);
  const dispatch = useDispatch();
  const { suppliers } = useSelector((state: RootState) => state.supplier);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [currentSupplier, setCurrentSupplier] =
    React.useState<ISupplier | null>(null);
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [view, setView] = React.useState<boolean>(false);

  const deleteSupplier = async () => {
    try {
      setConfirmLoading(true);
      const id = currentSupplier?._id as string;
      const response: any = await apis.DeleteSupplier(id);
      if (response.success) {
        messageAPI.open({
          type: "success",
          content: "Supplier deleted successfully",
        });

        const updatedSuppliers = suppliers.filter(
          (supplier: ISupplier) => supplier._id !== id
        );
        dispatch(setSuppliers(updatedSuppliers));
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

  const tableColumns = [
    {
      title: "Business Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Contact Name",
      dataIndex: "contactName",
    },
    {
      title: "Logo",
      dataIndex: "logo",
      render: (logo: string) => (
        <Image
          height={80}
          src={logo ? `${process.env.REACT_APP_SERVER_URL}/${logo}` : NoImage}
        />
      ),
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
                setCurrentSupplier(elm);
                setView(true);
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
                setCurrentSupplier(elm);
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
                  setCurrentSupplier(elm);
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

  const getSupplierList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetSupplierList();
      if (response.success) {
        dispatch(setSuppliers(response.suppliers));
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
    getSupplierList();
  }, []);

  return (
    <React.Fragment>
      <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
        <Typography.Title style={{ fontSize: 30, margin: 0 }}>
          <IntlMessage id={"supplier.management"} />
        </Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setCurrentSupplier(null);
            setMode("create");
            setOpen(true);
          }}
        >
          <IntlMessage id={"supplier.create-supplier"} />
        </Button>
      </Flex>
      <Card style={{ padding: "0px" }}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={suppliers}
            rowKey="_id"
            loading={loading}
          />
        </div>
      </Card>
      <SupplierModal
        title={
          mode === "create"
            ? "supplier.create-supplier"
            : "supplier.edit-supplier"
        }
        open={open}
        setOpen={setOpen}
        supplier={currentSupplier}
        mode={mode}
      />
      <SupplierView supplier={currentSupplier} open={view} setOpen={setView} />
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        handleOk={deleteSupplier}
        loading={confirmLoading}
      />
    </React.Fragment>
  );
};

export default SupplierList;
