import { Modal, Card, Flex, Select, Button, Steps, Input, Typography, Row, Col } from "antd";
import React from "react";
import { IRequest } from "utils/types";
import { MessageContext } from "layouts/Admin";
import { apis } from "apis";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { setRequests } from "store/slices/requestSlice";
import { store } from "store";

interface props {
    open: boolean;
    setOpen: (value: boolean) => void;
    request: IRequest | null
}


const RequestUpdateModal: React.FC<props> = ({ open, setOpen, request }) => {
    const { requests } = useSelector((state: RootState) => state.request);
    const messageAPI = React.useContext(MessageContext);
    const [status, setStatus] = React.useState("");
    const [statusLoading, setStatusLoading] = React.useState(false);
    const [current, setCurrent] = React.useState(0);

    const UpdateStatus = async () => {
        try {
            setStatusLoading(true);
            const response: any = await apis.UpdateRequest(request?._id as string, { status });
            if (response.status) {
                const updatedRequests = [...requests];
                const foundIndex = updatedRequests.findIndex((req: IRequest) => req._id === request?._id)
                updatedRequests[foundIndex] = response.request;
                store.dispatch(setRequests(updatedRequests));
                messageAPI.open({
                    type: "success",
                    content: "Request Status has been updated successfully",
                });
            }
            setStatusLoading(false);
        } catch (err: any) {
            messageAPI.open({
                type: "error",
                content: err.response.data.message,
            });
            setStatusLoading(false);
        }
    }

    React.useEffect(() => {
        if (request) {
            setStatus(request.status);
        }
    }, [request]);

    return (
        <Modal
            title="Edit Request"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
        >
            {request ?
                <>
                <Card size="small" title="Request Status">
                    <Flex align="center" gap={10}>
                        <Select
                            style={{ width: '100%' }}
                            value={status}
                            onChange={(status: string) => setStatus(status)}
                        >
                            <Select.Option value="Pending">Pending</Select.Option>
                            <Select.Option value="Complete">Complete</Select.Option>
                            <Select.Option value="Failed">Failed</Select.Option>
                            <Select.Option value="Rejected">Rejected</Select.Option>
                        </Select>
                        <Button
                            type="primary"
                            className="float-right"
                            size="small"
                            loading={statusLoading}
                            onClick={UpdateStatus}
                        >Update</Button>
                    </Flex>
                </Card>
                </> : null
            }
        </Modal >
    )
};

export default RequestUpdateModal;