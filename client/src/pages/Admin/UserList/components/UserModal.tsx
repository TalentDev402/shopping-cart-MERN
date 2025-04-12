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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setUsers } from "store/slices/userSlice";
import { IUser } from "utils/types";

interface UserModalProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  user: IUser | null;
  mode: "create" | "edit";
}

const UserModal: React.FC<UserModalProps> = ({
  title,
  open,
  user,
  mode,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<Array<any>>([]);
  const messageAPI = useContext(MessageContext);
  const { users } = useSelector((state: RootState) => state.user);
  const dipsatch = useDispatch();

  const handleCancel = () => {
    setOpen(false);
  };

  const saveUser: FormProps["onFinish"] = async (values) => {
    try {
      setConfirmLoading(true);
      if (values.avatar && values.avatar.fileList.length > 0) {
        const avatarFile = values.avatar.fileList[0].originFileObj;
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadResponse: any = await apis.UploadAvatar(formData, {
          headers: { "content-type": "multipart/form-data" },
        });

        if (uploadResponse.success) {
          values.avatar = uploadResponse.path;
        } else {
          values.avatar = undefined;
        }
      }
      let response: any;
      response =
        mode === "create"
          ? await apis.CreateUser(values)
          : await apis.UpdateUser(user?._id as string, values);
      if (response.success) {
        const updatedUser =
          mode === "create"
            ? [...users, response.user]
            : users.map((u: IUser) => {
                if (u._id !== user?._id) return u;
                else return response.user;
              });
        dipsatch(setUsers(updatedUser));
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
      if (user) {
        form.setFieldsValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        });
        if (user.avatar) {
          setFileList([
            {
              uid: "-1",
              name: "Avatar",
              status: "done",
              url: `${process.env.REACT_APP_SERVER_URL}/${user.avatar}`,
            },
          ]);
        }
      } else {
        setFileList([]);
      }
    }
  }, [open, user, form]);

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
        onFinish={saveUser}
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
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please input first name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please input last name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 8 }}
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select>
            <Select.Option value="ADMIN">Admin</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }} label="Avatar" name="avatar">
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
              style={{ border: 0, background: "none", cursor: "pointer" }}
              type="button"
            >
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
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

export default UserModal;
