import React from "react";
import { Modal, Flex, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface DeleteModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  loading: boolean;
  handleOk: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  setOpen,
  loading,
  handleOk,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={
        <>
          <ExclamationCircleOutlined
            style={{ color: "#ffa940", marginRight: 5 }}
          />
          Confirm
        </>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={400}
    >
      <p>Are you sure you want to delete?</p>
      <Flex justify="flex-end" gap={10}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="primary" onClick={handleOk} loading={loading}>
          Confirm
        </Button>
      </Flex>
    </Modal>
  );
};

export default DeleteModal;
