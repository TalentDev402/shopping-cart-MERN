import { Row, Col, Card } from "antd";
import styled from "@emotion/styled";
import LoginForm from "components/Admin/LoginForm";

const backgroundURL = "/img/img-17.jpg";
const backgroundStyle = {
  backgroundImage: `url(${backgroundURL})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const AuthContainer = styled.div(() => ({
  height: "100vh",
}));

const AdminLogin = () => {
  return (
    <AuthContainer>
      <div className="h-100" style={backgroundStyle}>
        <div className="container d-flex flex-column justify-content-center h-100">
          <Row justify="center">
            <Col xs={20} sm={20} md={20} lg={7}>
              <Card>
                <Row justify="center">
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <LoginForm />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </AuthContainer>
  );
};

export default AdminLogin;
