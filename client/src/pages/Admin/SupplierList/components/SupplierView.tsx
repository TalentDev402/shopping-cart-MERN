import {
  Drawer,
  Row,
  Col,
  Image,
  Flex,
  Typography,
  Divider,
  Button,
} from "antd";
import { ISupplier } from "utils/types";
import { DownloadOutlined } from "@ant-design/icons";

interface supplierViewProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  supplier: ISupplier | null;
}

const SupplierView: React.FC<supplierViewProps> = ({
  open,
  setOpen,
  supplier,
}) => {
  return (
    <Drawer title="Supplier Detail" onClose={() => setOpen(false)} open={open}>
      {supplier ? (
        <Row>
          <Col span={24}>
            <Flex justify="center">
              <Image
                height={100}
                src={`${process.env.REACT_APP_SERVER_URL}/${supplier.logo}`}
                style={{ borderRadius: 10 }}
              />
            </Flex>
          </Col>
          <Typography.Title level={3} style={{ margin: 0, marginTop: 20 }}>
            Basic Information
          </Typography.Title>
          <Divider style={{ margin: "5px 0px" }} />
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Business Name:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.name}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Business No:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.businessNumber}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Email:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.email}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Phone:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.phone}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Contact Name:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.contactName}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Website:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              <a href={`https://${supplier.website}`} target="_blank">
                {`https://${supplier.website}`}
              </a>
            </Typography.Title>
          </Col>
          <Typography.Title level={3} style={{ margin: 0, marginTop: 20 }}>
            Address
          </Typography.Title>
          <Divider style={{ margin: "5px 0px" }} />
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Country:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.address.country}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Address:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.address.address}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Zip code:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.address.zipCode}
            </Typography.Title>
          </Col>
          <Typography.Title level={3} style={{ margin: 0, marginTop: 20 }}>
            Bank Information
          </Typography.Title>
          <Divider style={{ margin: "5px 0px" }} />
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Bank Name:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.bankInfo?.bankName}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Branch:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.bankInfo?.branch}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Account No:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.bankInfo?.accountNumber}
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Account Name:
            </Typography.Title>
          </Col>
          <Col span={12}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {supplier.bankInfo?.accountName}
            </Typography.Title>
          </Col>
          <Typography.Title level={3} style={{ margin: 0, marginTop: 20 }}>
            Remarks
          </Typography.Title>
          <Divider style={{ margin: "5px 0px" }} />
          <Col span={24}>
            {supplier.remarks.type === "TEXT" ? (
              <Typography.Text style={{ fontWeight: "bold", fontSize: 15 }}>
                {supplier.remarks.content}
              </Typography.Text>
            ) : (
              <a
                href={`${process.env.REACT_APP_SERVER_URL}/${supplier.remarks.content}`}
                download
              >
                <Button type="primary" icon={<DownloadOutlined />} size="small">
                  Download File
                </Button>
              </a>
            )}
          </Col>
        </Row>
      ) : null}
    </Drawer>
  );
};

export default SupplierView;
