import React from "react";
import { Card, Image, Typography, Form, Flex, Button, Upload, type UploadProps, type UploadFile, type GetProp } from "antd"
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

const AboutPageSetting = () => {
    const dispatch = useDispatch();
    const { pages } = useSelector((state: RootState) => state.setting);
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<Array<any>>([]);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const messageAPI = React.useContext(MessageContext);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [previewImage, setPreviewImage] = React.useState('');
    const [editorState, setEditorState] = React.useState<EditorState>(EditorState.createEmpty());

    const saveAboutPageSetting = async (values: any) => {
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

            values.text = convertToRaw(editorState.getCurrentContent())
            const response: any = await apis.SavePageSetting({ ...values, page: 'about' });
            if (response.success) {
                dispatch(setPages(response.pages));
                messageAPI.open({
                    type: "success",
                    content: "About page setting saved successfully",
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
    }) => {setFileList(newFileList);
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const onEditorStateChange = (editorState: any) => {
        setEditorState(editorState);
    };


    React.useEffect(() => {
        if (pages && pages.about && form) {
            if (pages.about.text && pages.about.text.blocks) {
                setEditorState(EditorState.createWithContent(convertFromRaw(pages.about.text)))
            }
            if (pages.about.image) {
                setFileList([
                    {
                        uid: "-1",
                        name: "about",
                        status: "done",
                        url: `${process.env.REACT_APP_SERVER_URL}/${pages.about.image}`,
                    },
                ]);
            }
        }
    }, [pages, form]);

    return (
        <Card style={{ padding: 0 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
                About Us
            </Typography.Title>
            <Form
                name="about"
                form={form}
                style={{ width: "100%", marginTop: 20 }}
                onFinish={saveAboutPageSetting}
                autoComplete="off"
            >
                <Form.Item
                    style={{ marginBottom: 8 }}
                    name="text"
                >
                    <Editor
                        toolbar={RICH_TEXT_EDITOR_TOOBAR}
                        editorState={editorState}
                        toolbarClassName="rich-text-toolbar"
                        wrapperClassName="rich-text-wrapper"
                        editorClassName="rich-text-editor"
                        editorStyle={{ minHeight: 250, maxHeight: 400 }}
                        onEditorStateChange={onEditorStateChange}
                    />
                    <Typography.Paragraph style={{ marginTop: 10, marginLeft: 10, fontSize: 15, color: 'red' }}>
                        Please avoid copying formatted text. only copy plain text and make edits here.
                    </Typography.Paragraph>
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 8 }}
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

export default AboutPageSetting;