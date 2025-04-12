import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, Flex, Button, Select } from "antd";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { setProductDisplay } from "store/slices/settingSlice";
import { RootState } from "store";

interface IProductDisplayModal {
    currentProductDisplay: any;
    title: string;
    open: boolean;
    mode: boolean;
    setOpen: (value: boolean) => void;
    handleSuccess: () => void;
}

const ProductDisplayModal: React.FC<IProductDisplayModal> = ({ currentProductDisplay, title, open, mode, setOpen, handleSuccess }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const messageAPI = React.useContext(MessageContext);
    const { tags } = useSelector((state: RootState) => state.product);

    const handleClose = () => {
        setOpen(false);
    };

    const saveProductDisplay = async (values: any) => {
        try {
            setConfirmLoading(true);
            const response: any = mode ? await apis.CreateProductDisplay(values) : await apis.UpdateProductDisplay({ ...values, index: currentProductDisplay.index });
            if (response.success) {
                dispatch(setProductDisplay(response.productDisplay));
                messageAPI.open({
                    type: "success",
                    content: "Product Display created successfully",
                });
            }
            setConfirmLoading(false);
            setOpen(false);
            handleSuccess();
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
            if (currentProductDisplay) {
                form.setFieldsValue({
                    title: currentProductDisplay.title,
                    tag: currentProductDisplay.tag._id
                })
            }
        }
    }, [open]);

    return (
        <Modal
            title={title}
            open={open}
            onCancel={handleClose}
            footer={null}
            width={400}
        >
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ width: "100%", marginTop: 20 }}
                onFinish={saveProductDisplay}
                autoComplete="off"
            >
                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Title"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: "Please enter title!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Tag"
                    name="tag"
                    rules={[
                        {
                            required: true,
                            message: "Please select tag!",
                        },
                    ]}
                >
                    <Select
                        style={{ width: "100%" }}
                        options={tags.map((tag) => {
                            return { value: tag._id, label: tag.name };
                        })}
                    />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ offset: 6, span: 18 }}
                    style={{ marginBottom: 0, marginTop: 15 }}
                >
                    <Flex justify="flex-end" gap={10}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={confirmLoading}>
                            Save
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductDisplayModal;
