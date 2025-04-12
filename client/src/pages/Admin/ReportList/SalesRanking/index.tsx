import React from "react";
import {
    Flex,
    Typography,
    Card,
    Table,
    Image,
    DatePicker,
    Button
} from "antd";
import { apis } from "apis";
import NoImage from "assets/images/no-image.png";
import dayjs from 'dayjs';

const SalesRankingList = () => {
    const [rankings, setRankings] = React.useState<any>([]);
    const [loading, setLoading] = React.useState(false);
    const [startDate, setStartDate] = React.useState<any>(null);
    const [endDate, setEndDate] = React.useState<any>(null);
    const [firstLoading, setFirstLoading] = React.useState(false);

    const tableColumns = [
        {
            title: "Rank",
            dataIndex: "index",
        },
        {
            title: "Item No",
            dataIndex: "product",
            render: (product: any) => product ? product.itemNo : "Unknown",
        },
        {
            title: "Name",
            dataIndex: "product",
            render: (product: any) => product ? product.name : "Unknown",
        },
        {
            title: "Photo",
            dataIndex: "product",
            render: (product: any) => (
                <Image
                    width={80}
                    src={(product && product.photo) ? `${process.env.REACT_APP_SERVER_URL}/${product.photo}` : NoImage}
                />
            ),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            render: (amount: number) => <span> ${amount}</span>,
        },
    ];

    const onStartDateChange = (date: any) => {
        if (date) {
            setStartDate(dayjs(date));
        }
    }

    const onEndDateChange = (date: any) => {
        if (date) {
            setEndDate(dayjs(date));
        }
    }

    const ShowReport = async () => {
        try {
            setLoading(true);
            const startTimestamp = (new Date(startDate)).getTime();
            const endTimestamp = (new Date(endDate)).getTime();
            const response: any = await apis.GetSalesRankingList(startTimestamp, endTimestamp);
            if (response.success) {
                setRankings(response.rankings);
            }
            setLoading(false)
        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    }

    React.useEffect(() => {
        setRankings([]);
        const today = new Date();
        setStartDate(dayjs(new Date(today.getFullYear(), today.getMonth(), 1)));
        setEndDate(dayjs(today));
    }, []);

    React.useEffect(() => {
        if(startDate && endDate && !firstLoading) {
            ShowReport();
            setFirstLoading(true);
        }
    }, [startDate, endDate]);

    return (
        <React.Fragment>
            <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    Sales Ranking Report
                </Typography.Title>
            </Flex>
            <Card style={{ padding: "0px" }}>
                <Flex gap={10} align="center" style={{ marginBottom: 10 }}>
                    <DatePicker onChange={onStartDateChange} value={startDate} />
                    <DatePicker onChange={onEndDateChange} value={endDate} />
                    <Button
                        type="primary"
                        size="small"
                        onClick={ShowReport}
                    >Show Report</Button>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={rankings}
                        rowKey="index"
                        loading={loading}
                    />
                </div>
            </Card>
        </React.Fragment>
    )
};

export default SalesRankingList;