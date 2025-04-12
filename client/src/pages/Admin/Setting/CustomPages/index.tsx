import React from "react";
import { Flex, Typography, Tabs } from "antd";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import AboutPageSetting from "./components/AboutPageSetting";
import ContactPageSetting from "./components/ContactPageSetting";
import MembershipPageSetting from "./components/MembershipPageSetting";
import DeliveryMethodSetting from "./components/DeliveryMethodSetting";
import ShippingAndPaymentTermSetting from "./components/ShippingAndPaymentTermSetting";
import PrivacyPolicySetting from "./components/PrivacyPolicySetting";
import ReturnReplacementPolicySetting from "./components/ReturnReplacementPolicySetting";
import NewPageSetting from "./components/NewPageSetting";
import DashboardPageSetting from "./components/DashboardPageSetting";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CustomPages = () => {
    const [activeKey, setActiveKey] = React.useState('dashboard');

    return (
        <React.Fragment>
            <Flex align="center" style={{ marginBottom: 10 }}>
                <Typography.Title style={{ fontSize: 30, margin: 0 }}>
                    <IntlMessage id={"Custom Pages"} />
                </Typography.Title>
            </Flex>
            <Tabs
                activeKey={activeKey}
                items={[
                    {
                        key: 'dashboard',
                        label: <span onClick={() => setActiveKey('dashboard')}>Dashboard</span>,
                        children: <DashboardPageSetting />
                    },
                    {
                        key: 'about',
                        label: <span onClick={() => setActiveKey('about')}>About Us</span>,
                        children: <AboutPageSetting />
                    },
                    {
                        key: 'membership',
                        label: <span onClick={() => setActiveKey('membership')}>Membership</span>,
                        children: <MembershipPageSetting />
                    },
                    {
                        key: 'shippingPaymentTerms',
                        label: <span onClick={() => setActiveKey('shippingPaymentTerms')}>Shipping and Payment terms</span>,
                        children: <ShippingAndPaymentTermSetting />
                    },
                    {
                        key: 'deliveryMethods',
                        label: <span onClick={() => setActiveKey('deliveryMethods')}>Delivery Methods</span>,
                        children: <DeliveryMethodSetting />
                    },
                    {
                        key: 'privacyPolicy',
                        label: <span onClick={() => setActiveKey('privacyPolicy')}>Privacy Policy</span>,
                        children: <PrivacyPolicySetting />
                    },
                    {
                        key: 'returnReplacementPolicy',
                        label: <span onClick={() => setActiveKey('returnReplacementPolicy')}>Return and Replacement Policy</span>,
                        children: <ReturnReplacementPolicySetting />
                    },
                    {
                        key: 'contact',
                        label: <span onClick={() => setActiveKey('contact')}>Contact Us</span>,
                        children: <ContactPageSetting />
                    },
                    {
                        key: 'newsPage',
                        label: <span onClick={() => setActiveKey('newsPage')}>News Page</span>,
                        children: <NewPageSetting />
                    }
                ]}
            />
        </React.Fragment>
    )
};

export default CustomPages;