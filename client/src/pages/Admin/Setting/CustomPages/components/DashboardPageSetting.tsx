import React from "react";
import { Card, Image, Typography, Form, Flex, Button, Upload, type UploadProps, type UploadFile, type GetProp, Input } from "antd"
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { apis } from "apis";
import { setPages } from "store/slices/settingSlice";
import { MessageContext } from "layouts/Admin";
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { RICH_TEXT_EDITOR_TOOBAR } from "utils/constants";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const DashboardPageSetting = () => {
    const dispatch = useDispatch();
    const { pages } = useSelector((state: RootState) => state.setting);
    const [form] = Form.useForm();
    const [iconFileList, setIconFileList] = React.useState<Array<any>>([]);
    const [logoFileList, setLogoFileList] = React.useState<Array<any>>([]);
    const [bannerFileList, setBannerFileList] = React.useState<Array<any>>([]);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const messageAPI = React.useContext(MessageContext);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState('');
    const [title, setTitle] = React.useState('');

    const saveDashboardPageSetting = async (values: any) => {
        try {
            setConfirmLoading(true);
            console.log(values)
            if (values.title && values.logo?.fileList.length > 0) {
                const file = values.logo.fileList[0].originFileObj;
                const formData = new FormData();
                formData.append("file", file);
                const uploadResponse: any = await apis.UploadPageImage(formData, {
                    headers: { "content-type": "multipart/form-data" },
                });
                if (uploadResponse.success) {
                    values.logo = uploadResponse.path;
                } else {
                    values.logo = undefined;
                }
            } else {
                values.logo= undefined
            }

            if (values.icon) {
                const file = values.icon.fileList[0].originFileObj;
                const formData = new FormData();
                formData.append("file", file);
                const uploadResponse: any = await apis.UploadPageImage(formData, {
                    headers: { "content-type": "multipart/form-data" },
                });
                if (uploadResponse.success) {
                    values.icon = uploadResponse.path;
                } else {
                    values.icon = undefined;
                }
            } else {
                values.icon = undefined
            }

            let banner: any = []
            if (values.banner) {
              let func: any = [];
              if (values.banner?.fileList.length > 0) {
                values.banner.fileList.forEach((file: any) => {
                  if (file.status === "done") {
                    banner.push(`${file.name}`);
                  } else {
                    const logoFile = file.originFileObj;
                    const formData = new FormData();
                    formData.append("file", logoFile);
                    func.push(apis.UploadProductPhoto(formData, {
                      headers: { "content-type": "multipart/form-data" },
                    }))
                  }
                });
      
                const results = await Promise.all(func);
                results.forEach((res: any) => {
                  banner.push(res.path);
                });
              } else {
                values.banner = undefined;
              }
            } else {
              banner = undefined;
            }
            values.banner = banner;

            if (!values.logo && logoFileList.length > 0)
                values.logo = -1
            if (!values.icon && iconFileList.length > 0)
                values.icon = -1
            if (!values.banner && bannerFileList.length > 0)
                values.banner = -1

            console.log("values=", values)
            const response: any = await apis.SavePageSetting({ ...values, page: 'dashboard' });
            console.log(response)
            if (response.success) {
                dispatch(setPages(response.pages));
                messageAPI.open({
                    type: "success",
                    content: "Dashboard page setting saved successfully",
                });
            }
            setConfirmLoading(false);
        } catch (err: any) {
            setConfirmLoading(false);
            console.log(err)
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
        }
    }

    const handleIconImageChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        setIconFileList(newFileList);
        console.log(iconFileList);
    }

    const handleLogoImageChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        setLogoFileList(newFileList);
        console.log(logoFileList);
    }

    const handleBannerImageChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        setBannerFileList(newFileList);
        console.log(bannerFileList);
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    React.useEffect(() => {
        console.log(pages)
        if (pages && pages.dashboard && form) {
            if (pages.dashboard.title) {
                setTitle(pages.dashboard.title);
                form.setFieldsValue({ title: pages.dashboard.title });
            }
            if (pages.dashboard.logo) {
                setLogoFileList([
                    {
                        uid: "-1",
                        name: "dashboard",
                        status: "done",
                        url: `${process.env.REACT_APP_SERVER_URL}/${pages.dashboard.logo}`,
                    },
                ]);
            }
            if (pages.dashboard.icon) {
                setIconFileList([
                    {
                        uid: "-1",
                        name: "dashboard",
                        status: "done",
                        url: `${process.env.REACT_APP_SERVER_URL}/${pages.dashboard.icon}`,
                    },
                ]);
            }
            if (pages.dashboard.banner) {
                const temp = pages.dashboard.banner.map((banner: any, index: number) => {
                    return {
                        uid: `${index}`,
                        name: banner,
                        status: "done",
                        url: `${process.env.REACT_APP_SERVER_URL}/${banner}`,
                    }
                })
                setBannerFileList(temp);
            }
        }
    }, [pages, form]);

    return (
        <Card style={{ padding: 0 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
                Dashboard
            </Typography.Title>
            <Form
                name="dashboard"
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ width: "100%", marginTop: 20 }}
                onFinish={saveDashboardPageSetting}
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
                    label="Icon"
                    name="icon"
                >
                    <Upload
                        beforeUpload={() => false}
                        listType="picture-card"
                        maxCount={1}
                        showUploadList={{}}
                        onChange={handleIconImageChange}
                        fileList={iconFileList}
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
                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Logo"
                    name="logo"
                >
                    <Upload
                        beforeUpload={() => false}
                        listType="picture-card"
                        maxCount={1}
                        showUploadList={{}}
                        onChange={handleLogoImageChange}
                        fileList={logoFileList}
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
                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Banner"
                    name="banner"
                >
                    <Upload
                        beforeUpload={() => false}
                        listType="picture-card"
                        maxCount={10}
                        showUploadList={{}}
                        onChange={handleBannerImageChange}
                        fileList={bannerFileList}
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

export default DashboardPageSetting;