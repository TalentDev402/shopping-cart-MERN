import { useEffect, useContext, useState } from "react";
import { Button, Form, Input, Alert, Typography, Flex } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  hideAuthMessage,
  showAuthMessage,
  setLoading,
  signInSuccess,
} from "store/slices/authSlice";
import { APP_NAME, AUTHENTICATED_ENTRY } from "config/Admin/AppCofig";
import { useSelector } from "react-redux";
import { RootState, store } from "store";
import { apis } from "apis";
import { MessageContext } from "layouts/Admin";

export const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { showMessage, message, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const messageAPI = useContext(MessageContext);

  const [logo, setLogo] = useState('');
  const { pages } = useSelector((state: RootState) => state.setting);
  useEffect(() => {
    setLogo(pages?.dashboard.logo);
  },[pages]);
  const onLogin = async (values: any) => {
    try {
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
        align="center"
        gap={10}
        justify="center"
        style={{ marginBottom: showMessage ? 10 : 0 }}
      >
        <img src={`${process.env.REACT_APP_SERVER_URL}/${logo}`} alt={APP_NAME} width={50} />
        <Typography.Title level={3} style={{ margin: 0 }}>
          {APP_NAME.toUpperCase()}
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
      <Form layout="vertical" name="login-form" onFinish={onLogin}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
            {
              type: "email",
              message: "Please enter a validate email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-primary" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-primary" />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Continue
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePasswordForm;
