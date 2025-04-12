import React from "react";
import { Flex, Typography, Row, Col } from "antd";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import CurrencySetting from "./components/CurrencySetting";
import CompanyInfoSetting from "./components/CompanyInfoSetting";
import ProductDisplaySetting from "./components/ProductDisplaySetting";

const GeneralSetting = () => {
    return (
        <React.Fragment>
            <Flex align="center" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    <IntlMessage id={"General Setting"} />
                </Typography.Title>
            </Flex>
            <Row>
                <Col span={24} lg={12} xl={12} style={{ padding: '0 5px' }}>
                    <CurrencySetting />
                </Col>
                <Col span={24} lg={12} xl={12} style={{ padding: '0 5px' }}>
                    <CompanyInfoSetting />
                </Col>
                <Col span={24} lg={12} xl={12} style={{ padding: '0 5px' }}>
                    <ProductDisplaySetting />
                </Col>
            </Row>
        </React.Fragment>
    )
};

export default GeneralSetting;