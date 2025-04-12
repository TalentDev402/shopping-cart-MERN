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
import { IUser } from "utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { MessageContext } from "layouts/Admin";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import UserModal from "./components/UserModal";
import { apis } from "apis";
import { setUsers } from "store/slices/userSlice";
import DeleteModal from "components/Admin/Util-components/DeleteModal";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const messageAPI = useContext(MessageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.user);
  const [open, setOpen] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<IUser | null>(null);
  const [mode, setMode] = React.useState<"create" | "edit">("create");

  const deleteUser = async () => {
    try {
      setConfirmLoading(true);
      const userId = currentUser?._id as string;
      const response: any = await apis.DeleteUser(userId);
      if (response.success) {
        messageAPI.open({
          type: "success",
          content: "User deleted successfully",
        });
        const updatedUsers = users.filter((user: IUser) => user._id !== userId);
        dispatch(setUsers(updatedUsers));
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
      title: "User",
      dataIndex: "name",
      render: (_: any, record: IUser) => (
        <div className="d-flex">
          <AvatarStatus
            src={
              record.avatar
                ? `${process.env.REACT_APP_SERVER_URL}/${record.avatar}`
                : undefined
            }
            icon={record.avatar ? undefined : <UserOutlined />}
            name={record.firstName + " " + record.lastName}
            subTitle={record.email}
          />
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
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
          <Tooltip title="Edit">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentUser(elm);
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
                setCurrentUser(elm);
                setOpenDeleteModal(true);
              }}
              size="small"
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const getUserList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetUserList();
      if (response.success) {
        dispatch(setUsers(response.users));
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
    getUserList();
  }, []);

  React.useEffect(() => {
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.role === "ADMIN") {
        navigate("/admin");
      }
    }
  }, [token]);

  return (
    <React.Fragment>
      <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
        <Typography.Title style={{ fontSize: 30, margin: 0 }}>
          <IntlMessage id={"user.management"} />
        </Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setCurrentUser(null);
            setMode("create");
            setOpen(true);
          }}
        >
          <IntlMessage id={"user.create-user"} />
        </Button>
      </Flex>
      <Card style={{ padding: "0px" }}>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={users}
            rowKey="_id"
            loading={loading}
          />
        </div>
      </Card>
      <UserModal
        title={mode === "create" ? "user.create-user" : "user.edit-user"}
        open={open}
        setOpen={setOpen}
        user={currentUser}
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

export default UserList;
