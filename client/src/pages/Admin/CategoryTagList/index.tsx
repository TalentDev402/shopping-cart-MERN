import React from "react";
import { Row, Col, Typography } from "antd";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import TagList from "./components/TagList";
import CategoryList from "./components/CategoryList";

const CategoryTagList = () => {
  return (
    <React.Fragment>
      <Typography.Title style={{ fontSize: 30, margin: 0 }}>
        <IntlMessage id={"sidenav.category_tag"} />
      </Typography.Title>
      <Row style={{ marginTop: 15 }}>
        <Col span={24} sm={12} style={{ padding: "0px 5px" }}>
          <CategoryList />
        </Col>
        <Col span={24} sm={12} style={{ padding: "0px 5px" }}>
          <TagList />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CategoryTagList;
