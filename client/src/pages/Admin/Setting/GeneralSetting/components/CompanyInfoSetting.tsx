import React from "react";
import { Card, Typography, Input, Form, Flex, Button } from "antd"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { apis } from "apis";
import { setCompanyInfo } from "store/slices/settingSlice";
import { MessageContext } from "layouts/Admin";

const CompanyInfoSetting = () => {
    const dispatch = useDispatch();
    const { companyInfo } = useSelector((state: RootState) => state.setting);
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const messageAPI = React.useContext(MessageContext);

    const saveCompanyInfo = async (values: any) => {
        try {
            setConfirmLoading(true);
            const response: any = await apis.SaveComanyInfoSetting(values);
            if (response.success) {
                dispatch(setCompanyInfo(response.companyInfo));
                messageAPI.open({
                    type: "success",
                    content: "Company Info saved successfully",
                });
            }
            setConfirmLoading(false);
        } catch (err: any) {
            setConfirmLoading(false);
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
        }
    }

    React.useEffect(() => {
        if (companyInfo && form) {
            form.setFieldsValue({
                name: companyInfo.name,
                address: companyInfo.address,
                phone: companyInfo.phone
            })
        }
    }, [companyInfo, form]);

    return (
        <Card style={{ padding: 0 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
                Company Info Setting
            </Typography.Title>
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ width: "100%", marginTop: 20 }}
                onFinish={saveCompanyInfo}
                autoComplete="off"
            >
                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter name!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Address"
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: "Please enter adddress!",
                        },
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Phone"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: "Please enter phone!",
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
                        <Button type="primary" htmlType="submit" loading={confirmLoading}>
                            Save
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </Card>
    )
};

export default CompanyInfoSetting;