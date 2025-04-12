import React from "react";
import {
    Flex,
    Typography,
    Button,
    Card,
    Table,
    Image,
    Tooltip,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import NoImage from "assets/images/no-image.png";
import AdjustmentModal from "./components/AdjustmentModal";
import { IAdjustment, IProduct } from "utils/types";

const AdjustmentList = () => {
    const messageAPI = React.useContext(MessageContext);
    const [open, setOpen] = React.useState(false);
    const [mode, setMode] = React.useState<"create" | "edit">("create");
    const [adjustments, setAdjustments] = React.useState<IAdjustment[]>([]);
    const [currentAdjustment, setCurrentAdjustment] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [pagination, setPagination] = React.useState<any>({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const GetAdjustmentList = async () => {
        try {
            setLoading(true);
            setAdjustments([])
            const response: any = await apis.GetAdjustmentList({ current: pagination.current, pageSize: pagination.pageSize });
            if (response.success) {
                setAdjustments(response.adjustments);
                setPagination({
                    ...pagination,
                    total: response.total
                });
            }
            setLoading(false);
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
            setLoading(false);
        }
    };

    React.useEffect(() => {
        GetAdjustmentList();
    }, [pagination.current, pagination.pageSize]);

    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'adjustmentId'
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            render: (createAt: string) => (new Date(createAt)).toLocaleString()
        },
        {
            title: "Item No",
            dataIndex: "product",
            render: (product: IProduct) => product ? product.itemNo : "Unknown"
        },
        {
            title: "Name",
            dataIndex: "product",
            render: (product: IProduct) => product ? product.name : "Unknown"
        },
        {
            title: "Photo",
            dataIndex: "product",
            render: (product: IProduct) => (
                <Image
                    width={80}
                    src={product && product.photo ? `${process.env.REACT_APP_SERVER_URL}/${product.photo}` : NoImage}
                />
            ),
        },
        {
            title: "Reason",
            dataIndex: "reason",
            render: (reason: string) => (
                <Typography.Paragraph style={{ margin: 0, fontSize: 13, textWrap: "wrap" }}>
                    {reason}
                </Typography.Paragraph>
            ),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
        },
        // {
        //     title: "",
        //     dataIndex: "actions",
        //     render: (_: any, elm: any) => (
        //         <Flex gap={5} justify="flex-end">
        //             <Tooltip title="Edit">
        //                 <Button
        //                     type="primary"
        //                     ghost
        //                     icon={<EditOutlined />}
        //                     onClick={() => {
        //                         setCurrentAdjustment(elm);
        //                         setMode("edit");
        //                         setOpen(true);
        //                     }}
        //                     size="small"
        //                 />
        //             </Tooltip>
        //         </Flex>
        //     ),
        // },
    ];

    const handleTableChange = (change: any) => {
        setPagination(change);
    }

    return (
        <React.Fragment>
            <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    <IntlMessage id={"Adjustment List"} />
                </Typography.Title>
                <Button
                    type="primary"
                    onClick={() => {
                        setCurrentAdjustment(null);
                        setMode("create");
                        setOpen(true);
                    }}
                >
                    <IntlMessage id={"Create Adjustment"} />
                </Button>
            </Flex>
            <Card style={{ padding: "0px" }}>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={adjustments}
                        rowKey="_id"
                        loading={loading}
                        pagination={pagination}
                        onChange={handleTableChange}
                    />
                </div>
            </Card>
            <AdjustmentModal
                open={open}
                setOpen={setOpen}
                adjustment={currentAdjustment}
                refreshList={GetAdjustmentList}
                title={mode === "create" ? 'Create Adjustment' : 'Edit Adjustment'}
                mode={mode}
            />
        </React.Fragment>
    );
};

export default AdjustmentList;