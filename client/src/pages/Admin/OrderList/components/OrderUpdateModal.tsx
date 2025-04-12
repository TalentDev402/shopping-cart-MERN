import { Modal, Card, Flex, Select, Button, Steps, Input, Typography, Row, Col } from "antd";
import React from "react";
import { IOrder } from "utils/types";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { setOrders } from "store/slices/orderSlice";
import { store } from "store";

interface props {
    open: boolean;
    setOpen: (value: boolean) => void;
    order: IOrder | null
}

const trackStatus = ["ordered", "picked_by_courier", "on_the_way", "ready_for_pickup", "delivered"]

const OrderUpdateModal: React.FC<props> = ({ open, setOpen, order }) => {
    const { orders } = useSelector((state: RootState) => state.order);
    const messageAPI = React.useContext(MessageContext);
    const [orderStatus, setOrderStatus] = React.useState("");
    const [fee, setFee] = React.useState(0);
    const [paymentStatus, setPaymentStatus] = React.useState("");
    const [orderStatusLoading, setOrderStatusLoading] = React.useState(false);
    const [paymentStatusLoading, setPaymentStatusLoading] = React.useState(false);
    const [current, setCurrent] = React.useState(0);
    const [prevLoading, setPrevLoading] = React.useState(false);
    const [nextLoading, setNextLoading] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [shipLoading, setShipLoading] = React.useState(false);

    const NextStep = async () => {
        try {
            setNextLoading(true);
            const response: any = await apis.UpdateOrder(order?._id as string, {
                type: "order_track_status",
                data: {
                    orderTrackStatus: trackStatus[current + 1]
                }
            });
            if (response.status) {
                const udpatedOrders = [...orders];
                const foundIndex = udpatedOrders.findIndex((or: IOrder) => or._id === order?._id)
                udpatedOrders[foundIndex] = response.order;
                store.dispatch(setOrders(udpatedOrders));
                messageAPI.open({
                    type: "success",
                    content: "Order Track Status has been updated successfully",
                });
                setCurrent(current + 1);
            }
            setNextLoading(false);
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
            setNextLoading(false);
        }
    };

    const PrevStep = async () => {
        try {
            setPrevLoading(true);
            const response: any = await apis.UpdateOrder(order?._id as string, {
                type: "order_track_status",
                data: {
                    orderTrackStatus: trackStatus[current - 1]
                }
            });
            if (response.status) {
                const udpatedOrders = [...orders];
                const foundIndex = udpatedOrders.findIndex((or: IOrder) => or._id === order?._id)
                udpatedOrders[foundIndex] = response.order;
                store.dispatch(setOrders(udpatedOrders));
                messageAPI.open({
                    type: "success",
                    content: "Order Track Status has been updated successfully",
                });
                setCurrent(current - 1);
            }
            setPrevLoading(false);
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
            setPrevLoading(false);
        }
    };

    const UpdateShipInfo = async () => {
        try {
            setShipLoading(true);
            const response: any = await apis.UpdateOrder(order?._id as string, {
                type: "ship_info",
                data: {
                    email: email,
                    phone: phone,
                    address: address
                }
            });
            if (response.status) {
                const udpatedOrders = [...orders];
                const foundIndex = udpatedOrders.findIndex((or: IOrder) => or._id === order?._id)
                udpatedOrders[foundIndex] = response.order;
                store.dispatch(setOrders(udpatedOrders));
                messageAPI.open({
                    type: "success",
                    content: "Shipping Information has been updated successfully",
                });
            }
            setShipLoading(false);
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
            setShipLoading(false);
        }
    }

    const UpdateOrderStatus = async () => {
        try {
            setOrderStatusLoading(true);
            const response: any = await apis.UpdateOrder(order?._id as string, {
                type: "order_status",
                data: {
                    orderStatus: orderStatus,
                    fee: fee
                }
            });
            if (response.status) {
                const updatedOrders = [...orders];
                const foundIndex = updatedOrders.findIndex((or: IOrder) => or._id === order?._id)
                updatedOrders[foundIndex] = response.order;
                store.dispatch(setOrders(updatedOrders));
                messageAPI.open({
                    type: "success",
                    content: "Order Status has been updated successfully",
                });
            }
            setOrderStatusLoading(false);
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
            setOrderStatusLoading(false);
        }
    }
    const UpdatePaymentStatus = async () => {
        try {
            setPaymentStatusLoading(true);
            const response: any = await apis.UpdateOrder(order?._id as string, {
                type: "payment_status",
                data: {
                    paymentStatus: paymentStatus
                }
            });
            if (response.status) {
                const updatedOrders = [...orders];
                const foundIndex = updatedOrders.findIndex((or: IOrder) => or._id === order?._id)
                updatedOrders[foundIndex] = response.order;
                store.dispatch(setOrders(updatedOrders));
                messageAPI.open({
                    type: "success",
                    content: "Payment Status has been updated successfully",
                });
            }
            setPaymentStatusLoading(false);
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
            setPaymentStatusLoading(false);
        }
    }

    React.useEffect(() => {
        if (order) {
            setFee(order.fee);
            setOrderStatus(order.orderStatus);
            setPaymentStatus(order.paymentStatus);
            setCurrent(trackStatus.findIndex((status: string) => status === order.orderTrackStatus));
            setEmail(order.contactInfo.email);
            setPhone(order.contactInfo.phone);
            setAddress(order.shippingAddress);
        }
    }, [order]);

    return (
        <Modal
            title="Edit Order"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
        >
            {order ?
                <>
                <Card size="small" title="Order Status">
                    <Flex align="center" gap={10}>
                        <Select
                            style={{ width: '100%' }}
                            value={orderStatus}
                            onChange={(status: string) => setOrderStatus(status)}
                        >
                            <Select.Option value="Pending">Pending</Select.Option>
                            <Select.Option value="Complete">Complete</Select.Option>
                            <Select.Option value="Failed">Failed</Select.Option>
                            <Select.Option value="Rejected">Rejected</Select.Option>
                        </Select>
                        <Button
                            type="primary"
                            className="float-right"
                            size="small"
                            loading={orderStatusLoading}
                            onClick={UpdateOrderStatus}
                        >Update</Button>
                    </Flex>
                </Card>
                    <Card size="small" title="Payment Status">
                        <Flex align="center" gap={10}>
                            <Select
                                style={{ width: '100%' }}
                                value={paymentStatus}
                                onChange={(status: string) => setPaymentStatus(status)}
                            >
                                <Select.Option value="Pending">Pending</Select.Option>
                                <Select.Option value="Complete">Complete</Select.Option>
                                <Select.Option value="Failed">Failed</Select.Option>
                            </Select>
                            <Button
                                type="primary"
                                className="float-right"
                                size="small"
                                loading={paymentStatusLoading}
                                onClick={UpdatePaymentStatus}
                            >Update</Button>
                        </Flex>
                    </Card>
                    <Card size="small" title="Order Track Status">
                        <Flex style={{ padding: '0px 10px' }}>
                            <Steps
                                direction="vertical"
                                progressDot
                                current={current}
                                items={[
                                    { title: 'Ordered', },
                                    { title: 'Picked by courier' },
                                    { title: 'On the way' },
                                    { title: 'Ready for pickup' },
                                    { title: 'Delivered' },
                                ]}
                            />
                            <Flex justify="center" align="center" style={{ maxWidth: 300, width: '100%' }} gap={10}>
                                <Button
                                    type="primary"
                                    size="small"
                                    disabled={current === 0}
                                    onClick={PrevStep}
                                    loading={prevLoading}
                                >Prev</Button>
                                <Button
                                    type="primary"
                                    size="small"
                                    disabled={current === 4}
                                    onClick={NextStep}
                                    loading={nextLoading}
                                >Next</Button>
                            </Flex>
                        </Flex>
                    </Card>
                    <Card size="small" title="Shipping information">
                        <Row>
                            <Col span={6}>
                                <Flex align="center" style={{ height: '100%' }}>
                                    <Typography.Title level={5} style={{ margin: 0 }}>Email:</Typography.Title>
                                </Flex>
                            </Col>
                            <Col span={18}>
                                <Input value={email} placeholder="Email" onChange={(event: any) => setEmail(event.target.value)} />
                            </Col>
                            <Col span={6} style={{ marginTop: 5 }}>
                                <Flex align="center" style={{ height: '100%' }}>
                                    <Typography.Title level={5} style={{ margin: 0 }}>Phone:</Typography.Title>
                                </Flex>
                            </Col>
                            <Col span={18} style={{ marginTop: 5 }}>
                                <Input value={phone} placeholder="Phone" onChange={(event: any) => setPhone(event.target.value)} />
                            </Col>
                            <Col span={6} style={{ marginTop: 5 }}>
                                <Flex align="center" style={{ height: '100%' }}>
                                    <Typography.Title level={5} style={{ margin: 0 }}>Address:</Typography.Title>
                                </Flex>
                            </Col>
                            <Col span={18} style={{ marginTop: 5 }}>
                                <Input.TextArea value={address} placeholder="Addres" onChange={(event: any) => setAddress(event.target.value)} />
                            </Col>
                        </Row>
                        <Button
                            type="primary"
                            className="float-right mt-2"
                            size="small"
                            loading={shipLoading}
                            onClick={UpdateShipInfo}
                        >Update</Button>
                    </Card>
                </> : null
            }
        </Modal >
    )
};

export default OrderUpdateModal;