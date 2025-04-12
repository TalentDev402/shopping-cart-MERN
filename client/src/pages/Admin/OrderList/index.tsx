import React from "react";
import { useSelector } from "react-redux";
import { Flex, Typography, Card, Table, Tooltip, Button, Tag } from "antd";
import { MessageContext } from "layouts/Admin";
import { UserOutlined, EyeOutlined, EditOutlined, ExportOutlined } from "@ant-design/icons";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import AvatarStatus from "components/Admin/Shared-components/AvatarStatus";
import { RootState, store } from "store";
import { setOrders } from "store/slices/orderSlice";
import { apis } from "apis";
import { ICustomer, IOrder } from "utils/types";
import OrderUpdateModal from "./components/OrderUpdateModal";
import OrderView from "./components/OrderView";


const OrderList = () => {
    const { orders } = useSelector((state: RootState) => state.order);
    const messageAPI = React.useContext(MessageContext);
    const [loading, setLoading] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [currentOrder, setCurrentOrder] = React.useState<IOrder | null>(null);

    const orderStatusColor = (status: string) => {
        if (status === 'Pending') return "processing";
        else if (status === 'Complete') return "success";
        else if (status === 'Failed') return "error";
        else return "warning";
    }
    const orderPaymentColor = (status: string) => {
        if (status === 'Pending') return "processing";
        else if (status === 'Complete') return "success";
        else if (status === 'Failed') return "error";
        else return "warning";
    }

    const orderTrackStatusColor = (status: string) => {
        if (status === 'ordered') return "default";
        else if (status === 'picked_by_courier') return "orange";
        else if (status === 'on_the_way') return "processing";
        else if (status === 'ready_for_pickup') return "cyan";
        else return "green";
    }

    const orderTrackStatusText = (status: string) => {
        if (status === 'ordered') return "Ordered";
        else if (status === 'picked_by_courier') return "Picked By Courier";
        else if (status === 'on_the_way') return "On the Way";
        else if (status === 'ready_for_pickup') return "Ready for Pickup";
        else return "Delivered";
    }

    const tableColumns = [
        {
            title: 'Order',
            dataIndex: "orderId",
            render: (id: number) => (
                <span>#{id}</span>
            )
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            render: (record: string) => (
                <Typography.Title level={5} style={{ margin: 0, textWrap: "nowrap" }}>
                    {new Date(record).toLocaleString()}
                </Typography.Title>
            )
        },
        {
            title: "Customer",
            dataIndex: "customer",
            render: (record: ICustomer) => (
                <div className="d-flex">
                    <AvatarStatus
                        src={""}
                        icon={<UserOutlined />}
                        name={record.name}
                        subTitle={record.email}
                    />
                </div>
            ),
        },
        {
            title: "Order Status",
            dataIndex: "orderStatus",
            render: (status: string) => (
                <Tag bordered={true} style={{ fontSize: 20, padding: '5px 10px', borderRadius: 20 }} color={orderStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: "Payment Status",
            dataIndex: "paymentStatus",
            render: (status: string) => (
                <Tag bordered={true} style={{ fontSize: 20, padding: '5px 10px', borderRadius: 20 }} color={orderPaymentColor(status)}>{status}</Tag>
            ),
        },
        {
            title: "Track Status",
            dataIndex: "orderTrackStatus",
            render: (status: string) => (
                <Tag bordered={true} style={{ fontSize: 20, padding: '5px 10px', borderRadius: 20 }} color={orderTrackStatusColor(status)}>{orderTrackStatusText(status)}</Tag>
            ),
        },
        {
            title: "Amount",
            dataIndex: "items",
            render: (record: any, row: any) => (
                <Typography.Title level={4} style={{ margin: 0, textWrap: "nowrap" }}>
                    ${(record.reduce((pre: number, cur: any) => pre + cur.pricePerItem * cur.quantity, 0) + row.fee).toFixed(2)}
                </Typography.Title>
            )
        },
        {
            title: "Payment Methods",
            dataIndex: "paymentMethod",
            render: (method: string) => (
                <Typography.Title level={5} style={{ margin: 0, textWrap: "nowrap" }}>
                    {method}
                </Typography.Title>
            ),
        },
        {
            title: "",
            dataIndex: "actions",
            render: (_: any, elm: any, id: number) => (
                <Flex gap={5} justify="flex-end">
                    <Tooltip title="View details">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setCurrentOrder(elm);
                                setOpenView(true);
                            }}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Edit order">
                        <Button
                            type="primary"
                            ghost
                            icon={<EditOutlined />}
                            onClick={() => {
                                setCurrentOrder(elm);
                                setOpenEdit(true);
                            }}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Export Invoice">
                        <Button
                            type="primary"
                            ghost
                            icon={<ExportOutlined />}
                            onClick={() => {
                                handleExportBtn(elm);
                            }}
                            size="small"
                        />
                    </Tooltip>
                </Flex>
            ),
        }
    ];

    const GetOrderList = async () => {
        try {
            setLoading(true);
            const response: any = await apis.GetOrderList();
            if (response.status) {
                store.dispatch(setOrders(response.orders));
            }
            setLoading(false);
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
            setLoading(false);
        }
    }
    const handleExportBtn = async (data: any) => {
        try {
            const dataform = { "id" : data.orderId};
            const response: any = await apis.ExportOrder(dataform);
            if (response.success === true) {
                messageAPI.open({
                    type: "success",
                    content: "Download will start soon",
                });
                setTimeout(() => {
                    const pdfUrl = `${process.env.REACT_APP_SERVER_URL}/${response.path}`;
                    fetch(pdfUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/pdf',
                        },
                    })
                        .then((response) => response.blob())
                        .then((blob) => {
                            // Create blob link to download
                            const url = window.URL.createObjectURL(
                                new Blob([blob]),
                            );
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute(
                                'download',
                                `Invoice-${data.orderId}.pdf`
                            );
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            setTimeout(() => {
                                apis.DeleteInvoice(data.orderId);
                            }, 2000);
                        });
                }, 1500);
            }
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
        }
    }
    React.useEffect(() => {
        GetOrderList();
    }, []);

    return (
        <React.Fragment>
            <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    <IntlMessage id={"order.management"} />
                </Typography.Title>
            </Flex>
            <Card style={{ padding: "0px" }}>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={orders}
                        rowKey="_id"
                        loading={loading}
                    />
                </div>
            </Card>
            <OrderUpdateModal
                open={openEdit}
                setOpen={setOpenEdit}
                order={currentOrder}
            />
            <OrderView
                open={openView}
                setOpen={setOpenView}
                order={currentOrder}
            />
        </React.Fragment>
    );
};

export default OrderList;