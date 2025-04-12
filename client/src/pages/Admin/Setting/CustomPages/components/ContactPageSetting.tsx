import React from "react";
import { Card, Image, Typography, Input, Form, Flex, Button, Upload, type UploadProps, type UploadFile, type GetProp, Switch } from "antd"
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { apis } from "apis";
import { setPages } from "store/slices/settingSlice";
import { MessageContext } from "layouts/Admin";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const ContactPageSetting = () => {
    const dispatch = useDispatch();
    const { pages } = useSelector((state: RootState) => state.setting);
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<Array<any>>([]);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const messageAPI = React.useContext(MessageContext);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState('');

    const saveContactPageSetting = async (values: any) => {
        try {
            setConfirmLoading(true);
            if (values.image && values.image.fileList.length > 0) {
                const file = values.image.fileList[0].originFileObj;
                const formData = new FormData();
                formData.append("file", file);
                const uploadResponse: any = await apis.UploadPageImage(formData, {
                    headers: { "content-type": "multipart/form-data" },
                });

                if (uploadResponse.success) {
                    values.image = uploadResponse.path;
                } else {
                    values.image = undefined;
                }
            } else {
                values.image = undefined
            }

            if(!values.image && fileList.length > 0)
                values.image = -1
            
            const response: any = await apis.SavePageSetting({ ...values, page: 'contact' });
            if (response.success) {
                dispatch(setPages(response.pages));
                messageAPI.open({
                    type: "success",
                    content: "Contact page setting saved successfully",
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

    const handleImageChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => setFileList(newFileList);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    React.useEffect(() => {
        if (pages && pages.contact && form) {
            form.setFieldsValue({
                address: pages.contact.address,
                email: pages.contact.email,
                phone: pages.contact.phone,
                facebook: pages.contact.socials.filter((social: any) => social.type === "facebook").length > 0 ?
                    pages.contact.socials.filter((social: any) => social.type === "facebook")[0].link : "",
                facebookStatus: pages.contact.socials.filter((social: any) => social.type === "facebook").length > 0 ?
                    pages.contact.socials.filter((social: any) => social.type === "facebook")[0].status : false,
                instagram: pages.contact.socials.filter((social: any) => social.type === "instagram").length > 0 ?
                    pages.contact.socials.filter((social: any) => social.type === "instagram")[0].link : "",
                instagramStatus: pages.contact.socials.filter((social: any) => social.type === "instagram").length > 0 ?
                    pages.contact.socials.filter((social: any) => social.type === "instagram")[0].status : false,
                whatsapp: pages.contact.socials.filter((social: any) => social.type === "whatsapp").length > 0 ?
                    pages.contact.socials.filter((social: any) => social.type === "whatsapp")[0].link : "",
                whatsappStatus: pages.contact.socials.filter((social: any) => social.type === "whatsapp").length > 0 ?
                    pages.contact.socials.filter((social: any) => social.type === "whatsapp")[0].status : false,
            });
            if (pages.contact.image) {
                setFileList([
                    {
                        uid: "-1",
                        name: "about",
                        status: "done",
                        url: `${process.env.REACT_APP_SERVER_URL}/${pages.contact.image}`,
                    },
                ]);
            }
        }
    }, [pages, form]);

    return (
        <Card style={{ padding: 0 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
                Contact Us
            </Typography.Title>
            <Form
                name="contact"
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ width: "100%", marginTop: 20 }}
                onFinish={saveContactPageSetting}
                autoComplete="off"
            >
                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Address"
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: "Please enter address!",
                        },
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Please enter email!",
                        },
                    ]}
                >
                    <Input />
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

                <Form.Item label="Facebook" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="facebook"
                        style={{ display: 'inline-block', width: 'calc(100% - 100px)' }}
                    >
                        <Input placeholder="https://example.com" />
                    </Form.Item>
                    <Form.Item
                        name="facebookStatus"
                        style={{ display: 'inline-block', margin: '0 8px' }}
                    >
                        <Switch />
                    </Form.Item>
                </Form.Item>

                <Form.Item label="Instagram" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="instagram"
                        style={{ display: 'inline-block', width: 'calc(100% - 100px)' }}
                    >
                        <Input placeholder="https://example.com" />
                    </Form.Item>
                    <Form.Item
                        name="instagramStatus"
                        style={{ display: 'inline-block', margin: '0 8px' }}
                    >
                        <Switch />
                    </Form.Item>
                </Form.Item>

                <Form.Item label="WhatsApp" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="whatsapp"
                        style={{ display: 'inline-block', width: 'calc(100% - 100px)' }}
                    >
                        <Input placeholder="https://example.com" />
                    </Form.Item>
                    <Form.Item
                        name="whatsappStatus"
                        style={{ display: 'inline-block', margin: '0 8px' }}
                    >
                        <Switch />
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Image"
                    name="image"
                >
                    <Upload
                        beforeUpload={() => false}
                        listType="picture-card"
                        maxCount={1}
                        showUploadList={{}}
                        onChange={handleImageChange}
                        fileList={fileList}
                        onPreview={handlePreview}
                        accept="image/*"
                    >
                        <button
                            style={{
                                border: 0,
                                background: "none",
                                cursor: "pointer",
                            }}
                            type="button"
                        >
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>

                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}

                <Form.Item
                    wrapperCol={{ offset: 4, span: 20 }}
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

export default ContactPageSetting;