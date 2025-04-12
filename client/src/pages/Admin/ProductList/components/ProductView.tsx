import {
    Drawer,
    Row,
    Col,
    Tag,
    Typography,
    Divider,
    Image,
    Flex
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "store";

interface ProductViewProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    product: any;
}

const ProductView: React.FC<ProductViewProps> = ({
    open,
    setOpen,
    product
}) => {
    const { currency } = useSelector((state: RootState) => state.setting);
    const { categoryList } = useSelector((state: RootState) => state.product);

    const subCategory = (arr: any, indices: any) => {
        const result: any[] = [];
        indices.reduce((acc: any, curr: any) => {
            result.push(acc[curr].name);
            if (acc[curr].subCategory) return acc[curr].subCategory;
            else return [];
        }, arr);
        return result.join(" -> ");
    };

    const ShowCategory = (category: any) => {
        if (category && category.category && categoryList.length > 0) {
            const currentCategory = categoryList.filter(
                (cat: any) => cat._id === category.category._id
            )[0];

            if (currentCategory && currentCategory.subCategory) {
                const res = subCategory(currentCategory.subCategory, category.pos);
                return (
                    currentCategory.name + (category.pos.length > 0 ? " -> " : "") + res
                );
            } else return "";
        } else return "";
    };

    return (
        <Drawer title="Product Detail" onClose={() => setOpen(false)} open={open}>
            {product ? (
                <Row>
                    <Col span={24}>
                        <Flex justify="center">
                            <Image
                                height={150}
                                src={`${process.env.REACT_APP_SERVER_URL}/${product.photo}`}
                                style={{ borderRadius: 10 }}
                            />
                        </Flex>
                    </Col>
                    <Typography.Title level={3} style={{ margin: 0, marginTop: 10 }}>
                        Basic Information
                    </Typography.Title>
                    <Divider style={{ margin: "5px 0px" }} />
                    <Col span={8} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Item No:
                        </Typography.Title>
                    </Col>
                    <Col span={16} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            {product.itemNo}
                        </Typography.Title>
                    </Col>
                    <Col span={8} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Name:
                        </Typography.Title>
                    </Col>
                    <Col span={16} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            {product.name}
                        </Typography.Title>
                    </Col>
                    <Col span={8} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Description:
                        </Typography.Title>
                    </Col>
                    <Col span={16} style={{ margin: '2px 0px' }}>
                        <Typography.Paragraph style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                            {product.description}
                        </Typography.Paragraph>
                    </Col>
                    <Col span={8} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Supplier:
                        </Typography.Title>
                    </Col>
                    <Col span={16} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {product.supplier?.name}
                        </Typography.Title>
                    </Col>
                    <Typography.Title level={3} style={{ margin: 0, marginTop: 10 }}>
                        Inventory Detail
                    </Typography.Title>
                    <Divider style={{ margin: "5px 0px" }} />
                    <Col span={10} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Quantity:
                        </Typography.Title>
                    </Col>
                    <Col span={14} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {product.quantity}
                        </Typography.Title>
                    </Col>
                    <Col span={10} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Alert Quantity:
                        </Typography.Title>
                    </Col>
                    <Col span={14} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {product.alertQuantity}
                        </Typography.Title>
                    </Col>
                    <Col span={10} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Purchase Price:
                        </Typography.Title>
                    </Col>
                    <Col span={14} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {currency
                                ? `${currency.currencyList[currency.baseCurrency].name} ${currency.currencyList[currency.baseCurrency].symbol
                                }`
                                : ""}
                            {product.purchasePrice}
                        </Typography.Title>
                    </Col>
                    <Col span={10} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Selling Price:
                        </Typography.Title>
                    </Col>
                    <Col span={14} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {currency
                                ? `${currency.currencyList[currency.baseCurrency].name} ${currency.currencyList[currency.baseCurrency].symbol
                                }`
                                : ""}
                            {product.sellingPrice}
                        </Typography.Title>
                    </Col>
                    <Col span={10} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Category:
                        </Typography.Title>
                    </Col>
                    <Col span={14} style={{ margin: '2px 0px' }}>
                        <Typography.Paragraph style={{ margin: 0 }}>
                            {ShowCategory(product.category)}
                        </Typography.Paragraph>
                    </Col>
                    <Col span={10} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Tags:
                        </Typography.Title>
                    </Col>
                    <Col span={14} style={{ margin: '2px 0px' }}>
                        {product.tags.map((tag: any, index: number) => <Tag key={index}>{tag.name}</Tag>)}
                    </Col>
                    <Col span={10} style={{ margin: '2px 0px' }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            Status:
                        </Typography.Title>
                    </Col>
                    <Col span={14} style={{ margin: '2px 0px' }}>
                        <Tag className="text-capitalize" color={product.status ? "cyan" : "red"}>
                            {product.status ? "ACTIVE" : "INACTIVE"}
                        </Tag>
                    </Col>
                </Row>
            ) : null}
        </Drawer>
    )
};

export default ProductView;