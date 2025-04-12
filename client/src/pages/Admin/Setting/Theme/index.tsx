import React from "react";
import { Flex, Typography, Row, Col } from "antd";
import IntlMessage from "components/Admin/Util-components/IntlMessage";

const Theme = () => {
    return (
        <React.Fragment>
            <Flex align="center" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    <IntlMessage id={"Theme Style"} />
                </Typography.Title>
            </Flex>
            <Row>
                <Col span={24} lg={12} xl={12} style={{ padding: '0 5px' }}>
                </Col>
            </Row>
        </React.Fragment>
    )
};

export default Theme;