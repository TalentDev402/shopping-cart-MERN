import React from "react";
import ChangePassword from './components/ChangePassword'
import { Card, Flex, Typography, Row, Col } from "antd";
import IntlMessage from "components/Admin/Util-components/IntlMessage";

const AccountSetting = () => {
    return (
        <React.Fragment>
            <Flex align="center" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    <IntlMessage id={"Account Setting"} />
                </Typography.Title>
            </Flex>
            <Row>
                <Col xs={20} sm={20} md={20} lg={7}>
                    <Card>
                        <ChangePassword />
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
};

export default AccountSetting;