import {
    Drawer,
    Row,
    Col,
    Tag,
    Typography,
    Divider
} from "antd";
import { IOrder } from "utils/types";
import NoImage from "assets/images/no-image.png";

interface orderViewProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    order: IOrder | null;
}

const OrderView: React.FC<orderViewProps> = ({
    open,
    setOpen,
    order
}) => {

    const orderPaymentColor = (status: string) => {
        if (status === 'Pending') return "processing";
        else if (status === 'Complete') return "success";
        else if (status === 'Failed') return "error";
        else return "warning";
    }
    const orderStatusColor = (status: string) => {
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

    return (
        <Drawer title="Order Detail" onClose={() => setOpen(false)} open={open}>
            {order ? (
                <Row>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Order Details
                    </Typography.Title>
                    <Divider style={{ margin: "5px 0px" }} />
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Order:
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            #{order.orderId}
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Date:
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0, fontSize: 15 }}>
                            {new Date(order.createdAt).toLocaleString()}
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Order Status:
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Tag bordered={true} style={{ fontSize: 15, borderRadius: 20 }} color={orderStatusColor(order.orderStatus)}>{order.orderStatus}</Tag>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Payment Status:
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Tag bordered={true} style={{ fontSize: 15, borderRadius: 20 }} color={orderPaymentColor(order.paymentStatus)}>{order.paymentStatus}</Tag>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Track Status:
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Tag bordered={true} style={{ fontSize: 15, borderRadius: 20 }} color={orderTrackStatusColor(order.orderTrackStatus)}>{orderTrackStatusText(order.orderTrackStatus)}</Tag>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Transaction Id:
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            {order.transactionId}
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Payment method:
                        </Typography.Title>
                    </Col>
                    <Col span={12} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            {order.paymentMethod}
                        </Typography.Title>
                    </Col>
                    <Typography.Title level={3} style={{ margin: 0, marginTop: 20 }}>
                        Shipping Information
                    </Typography.Title>
                    <Divider style={{ margin: "5px 0px" }} />
                    <Col span={8} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Name:
                        </Typography.Title>
                    </Col>
                    <Col span={16} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0, fontSize: 15 }}>
                            {order.customer.name}
                        </Typography.Title>
                    </Col>
                    <Col span={8} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Email:
                        </Typography.Title>
                    </Col>
                    <Col span={16} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0, fontSize: 15 }}>
                            {order.contactInfo.email}
                        </Typography.Title>
                    </Col>
                    <Col span={8} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Phone:
                        </Typography.Title>
                    </Col>
                    <Col span={16} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0, fontSize: 15 }}>
                            {order.contactInfo.phone}
                        </Typography.Title>
                    </Col>
                    <Col span={8} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Address:
                        </Typography.Title>
                    </Col>
                    <Col span={16} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0, fontSize: 15 }}>
                            {order.shippingAddress}
                        </Typography.Title>
                    </Col>
                    <Typography.Title level={3} style={{ margin: 0, marginTop: 20 }}>
                        Items
                    </Typography.Title>
                    <Divider style={{ margin: "5px 0px" }} />
                    <table style={{ width: '100%' }}>
                        <tbody>
                            {order.items.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            width={80}
                                            height={80}
                                            src={item.product ? process.env.REACT_APP_SERVER_URL + "/" + item.product.photo : NoImage}
                                            alt="Product Image"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>
                                        <Typography.Title level={4} style={{ margin: 0 }}>
                                            {item.quantity}
                                        </Typography.Title>
                                    </td>
                                    <td>
                                        <Typography.Title level={4} style={{ margin: 0 }}>
                                            ×
                                        </Typography.Title>
                                    </td>
                                    <td>
                                        <Typography.Title level={4} style={{ margin: 0 }}>
                                            ${(item.pricePerItem).toFixed(2)}
                                        </Typography.Title>
                                    </td>
                                    <td>
                                        <Typography.Title level={4} style={{ margin: 0 }}>
                                            =
                                        </Typography.Title>
                                    </td>
                                    <td>
                                        <Typography.Title level={4} style={{ margin: 0 }}>
                                            ${(item.pricePerItem * item.quantity).toFixed(2)}
                                        </Typography.Title>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={6}>
                                    <Divider style={{ margin: "5px 0px" }} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <Typography.Title level={4} style={{ margin: 0, textAlign: 'right' }}>
                                        Fee:
                                    </Typography.Title>
                                </td>
                                <td colSpan={2}>
                                    <Typography.Title level={4} style={{ margin: 0, textAlign: 'center' }}>
                                        ${order.fee.toFixed(2)}
                                    </Typography.Title>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                    <Typography.Title level={4} style={{ margin: 0, textAlign: 'right' }}>
                                        Total:
                                    </Typography.Title>
                                </td>
                                <td colSpan={2}>
                                    <Typography.Title level={4} style={{ margin: 0, textAlign: 'center', color: 'red' }}>
                                        ${(order.items.reduce((pre: number, cur: any) => pre + cur.pricePerItem * cur.quantity, 0) + order.fee).toFixed(2)}
                                    </Typography.Title>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Row>
            ) : null}
        </Drawer>
    )
};

export default OrderView;