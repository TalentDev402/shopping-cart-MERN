import React, { useState, useContext } from "react";
import {
    Modal,
    Button,
    Flex,
    Form,
    type FormProps,
    Input,
    Select,
    Spin,
    type SelectProps,
    InputNumber,
} from "antd";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { IAdjustment, IProduct } from "utils/types";
import debounce from 'lodash/debounce';

interface AdjustmentModalProps {
    title: string;
    open: boolean;
    setOpen: (value: boolean) => void;
    adjustment: IAdjustment | null;
    mode: "create" | "edit";
    refreshList: () => void;
}

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

interface SelectValue {
    label: string;
    value: string;
}

function DebounceSelect<ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,>
    ({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
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


const AdjustmentModal: React.FC<AdjustmentModalProps> = ({
    title,
    open,
    adjustment,
    mode,
    setOpen,
    refreshList
}) => {
    const [form] = Form.useForm();
    const [item, setItem] = useState<SelectValue | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const messageAPI = useContext(MessageContext);

    const handleCancel = () => {
        setOpen(false);
    };

    const saveAdjustment: FormProps["onFinish"] = async (values) => {
        try {
            setConfirmLoading(true);
            let response: any = mode === 'create' ? await apis.CreateAdjustment({ ...values, product: values.itemNo.value })
                : await apis.EditAdjustment(adjustment?._id as string, { ...values, product: values.itemNo.value });
              if (response.success) {
                refreshList();  
              }
            messageAPI.open({
                type: "success",
                content: "Adjustment saved successfully",
            });
            setConfirmLoading(false);
            handleCancel();
        } catch (err: any) {
            setConfirmLoading(false);
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
        }
    };

    const fetchProductList = async (search: string): Promise<SelectValue[]> => {
        setProducts([]);
        return apis.FetchProductListByItemNo(search)
            .then((response: any) => {
                if (response.success) {
                    const values = response.products.map((product: IProduct) => {
                        return {
                            value: product._id,
                            label: product.itemNo
                        }
                    });
                    setProducts(response.products);
                    return values
                } else {
                    setProducts([]);
                    return [];
                }
            })
    }

    React.useEffect(() => {
        if (open) {
            form.resetFields();
            if (adjustment) {
                form.setFieldsValue({
                    itemNo: {
                        value: adjustment.product._id,
                        label: adjustment.product.itemNo
                    },
                    name: adjustment.product.name,
                    reason: adjustment.reason,
                    quantity: adjustment.quantity,
                });
            }
        }
    }, [open, adjustment, form]);

    React.useEffect(() => {
        if (form && item && products.length) {
            let filters = products.filter((product: IProduct) => product._id === item.value)
            if (filters.length > 0) {
                form.setFieldValue('name', filters[0].name)
            }
        }
    }, [form, item, products]);

    return (
        <Modal
            title={<IntlMessage id={title} />}
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={570}
        >
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ width: "100%" }}
                onFinish={saveAdjustment}
                autoComplete="off"
            >
                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Item No"
                    name="itemNo"
                    rules={[
                        {
                            required: true,
                            message: "Please input item number!",
                        },
                    ]}
                >
                    <DebounceSelect
                        showSearch={true}
                        value={item}
                        placeholder="Select product"
                        fetchOptions={fetchProductList}
                        onChange={(newValue) => {
                            setItem(newValue as SelectValue)
                        }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Name"
                    name="name"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 8 }}
                    label="Reason"
                    name="reason"
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item style={{ marginBottom: 8 }} label="Quantity" name="quantity">
                    <InputNumber style={{ width: "100%" }} step="1" />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ offset: 6, span: 18 }}
                    style={{ marginBottom: 0, marginTop: 15 }}
                >
                    <Flex justify="flex-end" gap={10}>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={confirmLoading}>
                            Save
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AdjustmentModal;
