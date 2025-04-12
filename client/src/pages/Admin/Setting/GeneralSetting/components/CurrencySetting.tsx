import React from "react";
import { Flex, Card, Table, Typography, Tooltip, Button, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import CurrencyModal from "./CurrencyModal";
import DeleteModal from "components/Admin/Util-components/DeleteModal";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { setCurrency } from "store/slices/settingSlice";

const CurrencySetting = () => {
  const { currency } = useSelector((state: RootState) => state.setting);
  const [open, setOpen] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [currentCurrency, setCurrentCurrency] = React.useState<any>(null);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const messageAPI = React.useContext(MessageContext);
  const dispatch = useDispatch();

  const DeleteCurrency = async () => {
    try {
      setConfirmLoading(true);
      const response: any = await apis.DeleteCurrency(currentCurrency);
      if (response.success) {
        dispatch(setCurrency(response.currency));
        messageAPI.open({
          type: "success",
          content: "Currency deleted succesfully",
        });
      }
      setConfirmLoading(false);
      setOpenDeleteModal(false);
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
      setConfirmLoading(false);
    }
  };

  const selectBaseCurrency = async (value: any) => {
    try {
      setConfirmLoading(true);
      const index = currency.currencyList.findIndex(
        (ca: any) => ca.name === value
      );
      const response: any = await apis.SetBaseCurrency({ currency: index });
      if (response.success) {
        dispatch(setCurrency(response.currency));
        messageAPI.open({
          type: "success",
          content: "The base currency has been set successfully",
        });
      }
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
    }
  };

  const columns = [
    {
      title: "Currency",
      dataIndex: "name",
      sort: false,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      sort: false,
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_: any, elm: any) => (
        <Tooltip title="Delete">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setConfirmLoading(false);
              setCurrentCurrency(elm.name);
              setOpenDeleteModal(true);
            }}
            size="small"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card style={{ padding: 0 }}>
      <Typography.Title level={3} style={{ margin: 0, marginBottom: 10 }}>
        Currency Setting
      </Typography.Title>
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
        <Flex align="center" gap={10}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Base Currency:
          </Typography.Title>
          {currency ? (
            <Select
              style={{ width: 100 }}
              defaultValue={currency.currencyList[currency.baseCurrency].name}
              onChange={selectBaseCurrency}
            >
              {currency.currencyList.map((currency: any) => (
                <Select.Option value={currency.name} key={currency.name}>
                  {currency.name} {currency.symbol}
                </Select.Option>
              ))}
            </Select>
          ) : null}
        </Flex>
        <Button type="primary" size="small" onClick={() => setOpen(true)}>
          Add New
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={currency?.currencyList}
        rowKey="name"
      />
      <CurrencyModal open={open} setOpen={setOpen} title="Create Currency" />
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpen}
        loading={confirmLoading}
        handleOk={DeleteCurrency}
      />
    </Card>
  );
};

export default CurrencySetting;
