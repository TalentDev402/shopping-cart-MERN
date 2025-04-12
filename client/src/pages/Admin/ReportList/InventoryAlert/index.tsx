import React from "react";
import {
    Flex,
    Typography,
    Card,
    Table,
    Image
} from "antd";
import { MessageContext } from "layouts/Admin";
import { setProducts } from "store/slices/productSlice";
import { apis } from "apis";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import NoImage from "assets/images/no-image.png";

const InventoryAlertList = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state: RootState) => state.product)
    const messageAPI = React.useContext(MessageContext);
    const [loading, setLoading] = React.useState(false);
    const [pagination, setPagination] = React.useState<any>({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const GetAlertProductList = async () => {
        try {
            setLoading(true);
            dispatch(setProducts([]));
            const response: any = await apis.GetProductAlertList({ current: pagination.current, pageSize: pagination.pageSize });
            if (response.success) {
                dispatch(setProducts(response.products));
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
        GetAlertProductList();
    }, [pagination.current, pagination.pageSize]);

    const tableColumns = [
        {
            title: "Item No",
            dataIndex: "itemNo",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Photo",
            dataIndex: "photo",
            render: (photo: string) => (
                <Image
                    width={80}
                    src={photo ? `${process.env.REACT_APP_SERVER_URL}/${photo}` : NoImage}
                />
            ),
        },
        {
            title: "Supplier",
            dataIndex: "supplier",
            render: (supplier: any) => (
                <Typography.Title level={5} style={{ margin: 0 }}>{supplier?.name}</Typography.Title>
            )
        },
        {
            title: "Alert Quantity",
            dataIndex: "alertQuantity",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
        },
    ];

    const handleTableChange = (change: any) => {
        setPagination(change);
    }

    return (
        <React.Fragment>
            <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    Inventory Alert Report
                </Typography.Title>
            </Flex>
            <Card style={{ padding: "0px" }}>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={products}
                        rowKey="_id"
                        loading={loading}
                        pagination={pagination}
                        onChange={handleTableChange}
                    />
                </div>
            </Card>
        </React.Fragment>
    );
};

export default InventoryAlertList;
