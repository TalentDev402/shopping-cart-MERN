import { useEffect, useContext, useState } from "react";
import { Button, Form, Input, Alert, Typography, Flex } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  hideAuthMessage,
  showAuthMessage,
  setLoading,
  signInSuccess,
} from "store/slices/authSlice";
import { AUTHENTICATED_ENTRY } from "config/Admin/AppCofig";
import { useSelector } from "react-redux";
import { RootState, store } from "store";
import { apis } from "apis";
import { MessageContext } from "layouts/Admin";

export const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { showMessage, message, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const [errors, setErrors] = useState("");
  const [newPass, setNewPass] = useState("");
  const messageAPI = useContext(MessageContext);

  const onChangePassword = async (values: any) => {
    try {
      //Validation
      if (values.newPassword != values.confirmPassword){
        setErrors("Passwords do not match.")
        return;
      }

      store.dispatch(setLoading(true));
      const response: any = await apis.AdminChangePassword(values);
      store.dispatch(setLoading(false));
      if (response?.token) {
        messageAPI.open({
          type: "success",
          content: response.message,
        });
        store.dispatch(signInSuccess(response.token));
        navigate(AUTHENTICATED_ENTRY);
      } else {
        store.dispatch(showAuthMessage(response.message));
      }
    } catch (err: any) {
      store.dispatch(showAuthMessage(err.response.data.message));
      store.dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => store.dispatch(hideAuthMessage()), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <>
      <Flex
        gap={10}
        style={{ marginBottom: showMessage ? 10 : 0 }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
            Change Password
        </Typography.Title>
      </Flex>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 10 : 0,
        }}
      >
        {message.indexOf("Success") == -1 ? <Alert type="error" showIcon message={message}></Alert> 
        : <Alert type="success" showIcon message={message}></Alert>}
      
      </motion.div>
      <Form layout="vertical" name="changePassword-form" onFinish={onChangePassword}>
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            {
              required: true,
              message: "Please input your current password",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-primary" />}
            placeholder="Current Password"
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            {
              required: true,
              message: "Please input your new password",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-primary" />}
            placeholder="New Password"
            onChange={e => setNewPass(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[
            {
              required: true,
              message: "Please input your password.",
            },
            {
              pattern: new RegExp('^' + newPass + '$'),
              message: "Confirm password must match with new password.",
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-primary" />}
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePasswordForm;
