import React from "react";
import { useSelector } from "react-redux";
import { Flex, Typography, Card, Table, Tooltip, Button, Tag } from "antd";
import { MessageContext } from "layouts/Admin";
import { UserOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import AvatarStatus from "components/Admin/Shared-components/AvatarStatus";
import { RootState, store } from "store";
import { setRequests } from "store/slices/requestSlice";
import { apis } from "apis";
import { IOrder, IRequest } from "utils/types";
import RequestUpdateModal from "./components/RequestUpdateModal";

const RequestList = () => {
    const messageAPI = React.useContext(MessageContext);
    const { requests } = useSelector((state: RootState) => state.request)
    const [loading, setLoading] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [currentRequest, setCurrentRequest] = React.useState<IRequest | null>(null);

    const requestStatusColor = (status: string) => {
        if (status === 'Pending') return "processing";
        else if (status === 'Complete') return "success";
        else if (status === 'Failed') return "error";
        else return "warning";
    }
    const tableColumns = [
        {
            title: 'RequestID',
            dataIndex: "requestId",
            render: (id: number) => (
                <span>#{id}</span>
            )
        },
        {
            title: 'OrderID',
            dataIndex: "order",
            render: (order: IOrder) => (
                <span>#{order.orderId}</span>
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
            render: (customer: any) => (
                <div className="d-flex">
                    <AvatarStatus
                        src={""}
                        icon={<UserOutlined />}
                        name={customer.name}
                        subTitle={customer.phone}
                        subTitle1={customer.email}
                    />
                </div>
            ),
        },
        {
            title: "Return Reason",
            dataIndex: "returnReason",
            render: (reason: string) => (
                <span>{reason}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status: string) => (
                <Tag bordered={true} style={{ fontSize: 20, padding: '5px 10px', borderRadius: 20 }} color={requestStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: "",
            dataIndex: "actions",
            render: (_: any, elm: any) => (
                <Flex gap={5} justify="flex-end">
                    <Tooltip title="Edit order">
                        <Button
                            type="primary"
                            ghost
                            icon={<EditOutlined />}
                            onClick={() => {
                                setCurrentRequest(elm);
                                setOpenEdit(true);
                            }}
                            size="small"
                        />
                    </Tooltip>
                </Flex>
            ),
        }
    ];

    const GetRequestList = async () => {
        try {
            setLoading(true);
            const response: any = await apis.GetRequestList();
            if (response.status) {
                store.dispatch(setRequests(response.requests));
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

    React.useEffect(() => {
        GetRequestList();
    }, []);

    return (
        <React.Fragment>
            <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    <IntlMessage id={"Return Request List"} />
                </Typography.Title>
            </Flex>
            <Card style={{ padding: "0px" }}>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={requests}
                        rowKey="_id"
                        loading={loading}
                    />
                </div>
            </Card>
            <RequestUpdateModal
                open={openEdit}
                setOpen={setOpenEdit}
                request={currentRequest}
            />
        </React.Fragment>
    );
};

export default RequestList;