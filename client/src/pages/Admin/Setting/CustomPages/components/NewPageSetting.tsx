import React from "react";
import { Card, Image, Typography, Form, Flex, Button, Upload, type UploadProps, type UploadFile, type GetProp, Input } from "antd"
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

const NewPageSetting = () => {
    const dispatch = useDispatch();
    const { pages } = useSelector((state: RootState) => state.setting);
    const [form] = Form.useForm();
    const [imageFileList, setImageFileList] = React.useState<Array<any>>([]);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const messageAPI = React.useContext(MessageContext);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState('');

    const saveNewPageSetting = async (values: any) => {
        try {
            setConfirmLoading(true);
            let images: any = []
            if (values.images) {
                let func: any = [];
                if (values.images.fileList.length > 0) {
                    values.images.fileList.forEach((file: any) => {
                        if (file.status === "done") {
                            images.push(`${file.name}`);
                        } else {
                            const logoFile = file.originFileObj;
                            const formData = new FormData();
                            formData.append("file", logoFile);
                            func.push(apis.UploadNewPagePhoto(formData, {
                                headers: { "content-type": "multipart/form-data" },
                            }))
                        }
                    });

                    const results = await Promise.all(func);
                    results.forEach((res: any) => {
                        images.push(res.path);
                    });
                } else {
                    values.images = []
                }
            }
            values.images = images;
            const response: any = await apis.SavePageSetting({ ...values, page: 'newPage' });
            if (response.success) {
                dispatch(setPages(response.pages));
                messageAPI.open({
                    type: "success",
                    content: "New Page Images saved successfully",
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
    }) => {
        setImageFileList(newFileList);
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    React.useEffect(() => {
        if (pages && pages.newPage) {
            if (pages.newPage.images) {
                const temp = pages.newPage.images.map((image: any, index: number) => {
                    return {
                        uid: `${index}`,
                        name: `${image}`,
                        status: "done",
                        url: `${process.env.REACT_APP_SERVER_URL}/${image}`,
                    }
                })
                setImageFileList(temp);
            }
        }
    }, [pages, form]);

    return (
        <Card style={{ padding: 0 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
                New Page
            </Typography.Title>
            <Form
                name="newPage"
                form={form}
                labelCol={{ span: 1 }}
                wrapperCol={{ span: 24 }}
                style={{ width: "100%", marginTop: 20 }}
                onFinish={saveNewPageSetting}
                autoComplete="off"
            >
                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Images"
                    name="images"
                >
                    <Upload
                        beforeUpload={() => false}
                        listType="picture-card"
                        maxCount={20}
                        showUploadList={{}}
                        onChange={handleImageChange}
                        fileList={imageFileList}
                        onPreview={handlePreview}
                        multiple={true}
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

export default NewPageSetting;