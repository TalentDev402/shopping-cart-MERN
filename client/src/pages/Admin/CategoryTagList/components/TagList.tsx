import React from "react";
import {
  Card,
  Typography,
  type InputRef,
  Tag,
  Tooltip,
  Input,
  Flex,
} from "antd";
import IntlMessage from "components/Admin/Util-components/IntlMessage";
import {
  PlusOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { apis } from "apis";
import { MessageContext } from "layouts/Admin";
import { setTags } from "store/slices/productSlice";
import type { ITag } from "utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import DeleteModal from "components/Admin/Util-components/DeleteModal";

const tagInputStyle: React.CSSProperties = {
  width: 120,
  height: 32,
  marginInlineEnd: 8,
  margin: 5,
  verticalAlign: "top",
  fontSize: 15,
};

const TagList = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { tags } = useSelector((state: RootState) => state.product);
  const messageAPI = React.useContext(MessageContext);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [currentId, setCurrentId] = React.useState<any>(null);
  const [inputVisible, setInputVisible] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<InputRef>(null);

  const deleteTag = async () => {
    try {
      setConfirmLoading(true);
      const id = currentId as string;
      const response: any = await apis.DeleteTag(id);
      if (response.success) {
        const newTags = tags.filter((tag: ITag) => tag._id !== id);
        dispatch(setTags(newTags));
        messageAPI.open({
          type: "success",
          content: "Product Tag successfully deleted",
        });
      }
      setConfirmLoading(false);
      setOpenDeleteModal(false);
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
    }
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = async () => {
    try {
      setLoading(true);
      if (
        inputValue &&
        !tags.map((tag: ITag) => tag.name).includes(inputValue)
      ) {
        const response: any = await apis.CreateTag({ name: inputValue });
        if (response.success) {
          dispatch(setTags([...tags, response.tag]));
          messageAPI.open({
            type: "success",
            content: "Product Tag successfully created",
          });
        }
      }
      setInputVisible(false);
      setInputValue("");
      setLoading(false);
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
      setLoading(false);
    }
  };

  const GetTagList = async () => {
    try {
      setLoading(true);
      const response: any = await apis.GetTagList();
      if (response.success) {
        dispatch(setTags(response.tags));
      }
      setLoading(false);
    } catch (err: any) {
      messageAPI.open({
        type: "error",
        content: err.response.data.message,
      });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  React.useEffect(() => {
    GetTagList();
  }, []);

  return (
    <Card style={{ padding: 0 }}>
      <Typography.Title level={3}>
        <IntlMessage id={"product.tag.list"} />
      </Typography.Title>
      {tags.map<React.ReactNode>((tag, index) => {
        const isLongTag = tag.name.length > 20;
        const tagElem = (
          <Tag
            key={tag._id}
            color="success"
            style={{ userSelect: "none", fontSize: 15, padding: 5, margin: 5 }}
          >
            <Flex align="center" gap={5}>
              <span>
                {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
              </span>
              {currentUser?.role === "SUPER_ADMIN" ? (
                <CloseOutlined
                  style={{ fontSize: 12, color: "grey" }}
                  onClick={() => {
                    setCurrentId(tag._id);
                    setOpenDeleteModal(true);
                    setConfirmLoading(false);
                  }}
                />
              ) : null}
            </Flex>
          </Tag>
        );

        return isLongTag ? (
          <Tooltip title={tag.name} key={tag._id}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}

      {inputVisible ? (
        <React.Fragment>
          {loading ? (
            <Tag
              style={{ padding: 5, margin: 5, fontSize: 15, borderWidth: 0 }}
              icon={<LoadingOutlined />}
            />
          ) : (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={tagInputStyle}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
        </React.Fragment>
      ) : (
        <Tag
          style={{ fontSize: 15, padding: 5, margin: 5 }}
          icon={<PlusOutlined style={{ fontSize: 12 }} />}
          onClick={showInput}
        >
          New Tag
        </Tag>
      )}
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        loading={confirmLoading}
        handleOk={deleteTag}
      />
    </Card>
  );
};

export default TagList;
