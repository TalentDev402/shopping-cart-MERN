import React from "react";
import { Card, Flex, Typography, Button, Table, Tooltip, Tag } from "antd"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ProductDisplayModal from "./ProductDisplayModal";
import { apis } from "apis";
import { setTags } from "store/slices/productSlice";
import DeleteModal from "components/Admin/Util-components/DeleteModal";
import { MessageContext } from "layouts/Admin";
import { setProductDisplay } from "store/slices/settingSlice";

const ProductDisplaySetting = () => {
    const [open, setOpen] = React.useState(false);
    const [mode, setMode] = React.useState(true);
    const { productDisplay } = useSelector((state: RootState) => state.setting);
    const [currentProductDisplay, setCurrentProductDisplay] = React.useState<any>(null);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const messageAPI = React.useContext(MessageContext);
    const dispatch = useDispatch();

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            sort: false,
        },
        {
            title: "Tag",
            dataIndex: "tag",
            render: (elm: any) => (
                <Tag>{elm.name}</Tag>
            ),
        },
        {
            title: "",
            dataIndex: "actions",
            render: (_: any, elm: any, index: number) => (
                <Flex gap={5}>
                    <Tooltip title="Edit">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setCurrentProductDisplay({ ...elm, index: index });
                                setMode(false);
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
                                setCurrentProductDisplay({ ...elm, index: index });
                                setOpenDeleteModal(true);
                            }}
                            size="small"
                        />
                    </Tooltip>
                </Flex>
            ),
        },
    ]

    const GetTagList = async () => {
        try {
            const response: any = await apis.GetTagList();
            if (response.success) {
                dispatch(setTags(response.tags));
            }
        } catch (err: any) {
            console.log(err);
        }
    };

    const DeleteProductDisplay = async () => {
        try {
            setConfirmLoading(true);
            const response: any = await apis.DeleteProductDisplay(Number(currentProductDisplay?.index));
            if (response.success) {
                dispatch(setProductDisplay(response.productDisplay));
                messageAPI.open({
                    type: "success",
                    content: "Product Display deleted succesfully",
                });
            }
            setConfirmLoading(false);
            setOpenDeleteModal(false);
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
            setConfirmLoading(false);
        }
    }

    React.useEffect(() => {
        GetTagList();
    }, []);

    return (
        <Card style={{ padding: 0 }}>
            <Typography.Title level={3} style={{ margin: 0, marginBottom: 10 }}>
                Product Display Setting
            </Typography.Title>
            <Flex justify="flex-end" style={{ marginBottom: 10 }}>
                <Button type="primary" size="small" onClick={() => {
                    setMode(true);
                    setCurrentProductDisplay(null);
                    setOpen(true);
                }}>
                    Add New
                </Button>
            </Flex>
            <Table
                columns={columns}
                dataSource={productDisplay}
                rowKey="title"
            />
            <ProductDisplayModal
                title={mode ? "Create" : "Edit"}
                open={open}
                mode={mode}
                currentProductDisplay={currentProductDisplay}
                setOpen={setOpen}
                handleSuccess={GetTagList}
            />
            <DeleteModal
                open={openDeleteModal}
                setOpen={setOpen}
                loading={confirmLoading}
                handleOk={DeleteProductDisplay}
            />
        </Card>
    )
};

export default ProductDisplaySetting;