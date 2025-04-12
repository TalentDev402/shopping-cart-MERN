import React, { useState, useEffect } from "react";
import {
    Flex,
    Typography,
    Card,
    Table,
    DatePicker,
    Select,
    Button,
    TreeSelect,
    Spin,
    type SelectProps,
} from "antd";
import { apis } from "apis";
import dayjs from 'dayjs';
import { RootState } from "store";
import { setCategoryList } from "store/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { MessageContext } from "layouts/Admin";
import { IProduct } from "utils/types";
import debounce from 'lodash/debounce';

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
    category: string;
}

interface SelectValue {
    label: string;
    value: string;
}

function DebounceSelect<ValueType extends { key?: string; label: React.ReactNode; value: string | number; } = any,>
    ({ fetchOptions, debounceTimeout = 800, category, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = React.useRef(0);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    useEffect(() => {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);

        fetchOptions('').then((newOptions) => {
            if (fetchId !== fetchRef.current) {
                // for fetch callback order
                return;
            }

            setOptions(newOptions);
            setFetching(false);
        });

    }, [category])

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Flex justify="center" style={{ width: '100%' }}><Spin size="small" /></Flex> : null}
            {...props}
            options={options}
        />
    );
}
const InventoryTrendList = () => {
    const dispatch = useDispatch();
    const [trends, setTrends] = React.useState<any>([]);
    const [loading, setLoading] = React.useState(false);
    const [startDate, setStartDate] = React.useState<any>(null);
    const [endDate, setEndDate] = React.useState<any>(null);
    const [category, setCategory] = React.useState("");
    const [disabled, setDisabled] = React.useState(true);
    const [item, setItem] = useState<SelectValue | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    const { categoryList } = useSelector(
        (state: RootState) => state.product
    );
    const messageAPI = React.useContext(MessageContext);

    const tableColumns = [
        {
            title: "Date",
            dataIndex: "date",
            render: (date: string) => date ? <span>{date.slice(0, 10)}</span> : <span>-</span>,
        },
        {
            title: "Opening Inventory",
            dataIndex: "openingCount",
            render: (openingCount: number) => openingCount ? <span>{openingCount}</span> : <span>-</span>,
        },
        {
            title: "Sales Quantity",
            dataIndex: "salesCount",
            render: (salesCount: number) => salesCount ? <span>{salesCount}</span> : <span>-</span>,
        },
        {
            title: "Replenishment(Adjustment)Quantity",
            dataIndex: "adjustCount",
            render: (adjustCount: number) => adjustCount ? <span>{adjustCount}</span> : <span>-</span>,
        },
        {
            title: "Closing Inventory",
            dataIndex: "closingCount",
            render: (closingCount: number) => closingCount ? <span>{closingCount}</span> : <span>-</span>,
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
            const response: any = await apis.GetInventoryTrendList({
                start_at: startTimestamp,
                end_at: endTimestamp,
                product_name: item?.label
            });
            if (response.success) {
                setTrends(response.trends);
            }
            setLoading(false)
        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    }

    const GetCategoryList = async () => {
        try {
            const response: any = await apis.GetCategoryList();
            if (response.success) {
                dispatch(setCategoryList(response.categoryList));
            }
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
        }
    };

    const fetchProductList = async (search: string): Promise<SelectValue[]> => {
        setProducts([]);
        return apis.FetchProductListByName(search)
            .then((response: any) => {
                if (response.success) {
                    const values = response.products.filter((product: IProduct) => {
                        const positions = category.split("-");
                        const index = Number(positions[1]);
                        const pos = positions.slice(2).map((p: string) => Number(p));
                        const id = categoryList.at(index)._id;
                        if(positions.length === 2) return product.category.category.toString() === id;
                        else return product.category.category.toString() === id && product.category.pos[0] === pos[0];
                    });
                    const results = values.map((product: IProduct) => {
                        return {
                            value: product._id,
                            label: product.name
                        }
                    });
                    setProducts(response.products);
                    return results
                } else {
                    setProducts([]);
                    return [];
                }
            })
    }

    React.useEffect(() => {
        GetCategoryList();
    }, []);

    React.useEffect(() => {
        if(startDate && endDate && category && item?.label) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [startDate, endDate, category, item?.label]);

    React.useEffect(() => {
        const today = new Date();
        setStartDate(dayjs(new Date(today.getFullYear(), today.getMonth(), 1)));
        setEndDate(dayjs(today));
    }, []);

    const CategoryTree = (parentKey: string, subCategory: any) => {
        return subCategory.map((category: any, index: number) => {
            return {
                title: category.name,
                value: `${parentKey}-${index}`,
                children: CategoryTree(`${parentKey}-${index}`, category.subCategory),
            };
        });
    };

    const categoryTreeData = React.useMemo(() => {
        return categoryList.map((category: any, index: number) => {
            return {
                title: category.name,
                value: `0-${index}`,
                children: CategoryTree(`0-${index}`, category.subCategory),
            };
        });
    }, [categoryList]);

    return (
        <React.Fragment>
            <Flex align="center" justify="space-between" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    Inventory Trend Report
                </Typography.Title>
            </Flex>
            <Card style={{ padding: "0px" }}>
                <Flex gap={10} style={{ marginBottom: 10 }}>
                    <DatePicker onChange={onStartDateChange} value={startDate} />
                    <DatePicker onChange={onEndDateChange} value={endDate} />
                </Flex>
                <Flex gap={10} style={{ marginBottom: 10 }}>
                    <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                        treeData={categoryTreeData}
                        onChange={(val) => setCategory(val)}
                        style={{ width: "100%" }}
                    />
                    <DebounceSelect
                        showSearch={true}
                        value={item}
                        placeholder="Select product"
                        fetchOptions={fetchProductList}
                        category={category}
                        onChange={(newValue) => {
                            setItem(newValue as SelectValue)
                        }}
                        style={{ width: "100%" }}
                    />
                </Flex>
                <Flex gap={10} style={{ marginBottom: 10 }}>
                    <Button
                        type="primary"
                        size="small"
                        disabled={disabled}
                        onClick={ShowReport}
                    >Show Report</Button>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={trends}
                        rowKey="date"
                        loading={loading}
                    />
                </div>
            </Card>
        </React.Fragment>
    )
};

export default InventoryTrendList;