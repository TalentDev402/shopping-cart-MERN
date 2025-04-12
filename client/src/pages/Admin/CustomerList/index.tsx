import React, { useContext } from "react";
import {
  Card,
  Table,
  Tag,
  Tooltip,
  Button,
  Typography,
  Flex,
} from "antd";
import { DeleteOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";
import AvatarStatus from "components/Admin/Shared-components/AvatarStatus";
import { ICustomer } from "utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { MessageContext } from "layouts/Admin";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import CustomerModal from "./components/CustomerModal";
import { apis } from "apis";
import { setCustomers } from "store/slices/customerSlice";
import DeleteModal from "components/Admin/Util-components/DeleteModal";

const CustomerList = () => {
  const messageAPI = useContext(MessageContext);
  const dispatch = useDispatch();
  const { customers } = useSelector((state: RootState) => state.customer);
  const [open, setOpen] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [currentCustomer, setCurrentCustomer] = React.useState<ICustomer | null>(null);
  const [mode, setMode] = React.useState<"create" | "edit">("create");

  const deleteUser = async () => {
    try {
      setConfirmLoading(true);
      const customerId = currentCustomer?._id as string;
      const response: any = await apis.DeleteCustomer(customerId);
      if (response.success) {
        messageAPI.open({
          type: "success",
          content: "Customer deleted successfully",
        });
        const updatedCustomers = customers.filter((customer: ICustomer) => customer._id !== customerId);
        dispatch(setCustomers(updatedCustomers));
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
      title: "Customer",
      dataIndex: "name",
      render: (_: any, record: ICustomer) => (
        <div className="d-flex">
          <AvatarStatus
            icon={<UserOutlined />}
            name={record.name}
            subTitle={record.email}
          />
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Points",
      dataIndex: "points",
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_: any, elm: any) => (
        <Flex gap={5} justify="flex-end">
          <Tooltip title="Edit">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentCustomer(elm);
                setMode("edit");
                setOpen(true);
              }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setConfirmLoading(false);
                setCurrentCustomer(elm);
                setOpenDeleteModal(true);
              }}
              size="small"
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const getCustomerList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetCustomerList();
      if (response.success) {
        dispatch(setCustomers(response.customers));
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
    getCustomerList();
  }, []);

  return (
    <React.Fragment>
      <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
        <Typography.Title style={{ fontSize: 30, margin: 0 }}>
          <IntlMessage id={"customer.management"} />
        </Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setCurrentCustomer(null);
            setMode("create");
            setOpen(true);
          }}
        >
          <IntlMessage id={"customer.create-customer"} />
        </Button>
      </Flex>
      <Card style={{ padding: "0px" }}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={customers}
            rowKey="_id"
            loading={loading}
          />
        </div>
      </Card>
      <CustomerModal
        title={mode === "create" ? "customer.create-customer" : "customer.edit-customer"}
        open={open}
        setOpen={setOpen}
        customer={currentCustomer}
        mode={mode}
      />
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        loading={confirmLoading}
        handleOk={deleteUser}
      />
    </React.Fragment>
  );
};

export default CustomerList;
