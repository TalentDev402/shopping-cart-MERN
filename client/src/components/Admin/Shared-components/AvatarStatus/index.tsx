import { Avatar, Flex } from "antd";

const renderAvatar = (props: any) => {
  return (
    <Avatar {...props} className={`ant-avatar-${props.type}`}>
      {props.text}
    </Avatar>
  );
};

export const AvatarStatus = (props: any) => {
  const {
    name,
    suffix,
    subTitle,
    subTitle1,
    id,
    type,
    src,
    icon,
    size,
    shape,
    gap,
    text,
    onNameClick,
  } = props;
  return (
    <Flex justify="space-center" align="center" gap={10}>
      {renderAvatar({ icon, src, type, size, shape, gap, text })}
      <div>
        <div>
          {onNameClick ? (
            <div
              onClick={() => onNameClick({ name, subTitle, src, id })}
              className="avatar-status-name clickable"
            >
              {name}
            </div>
          ) : (
            <div className="avatar-status-name">{name}</div>
          )}
          <span>{suffix}</span>
        </div>
        <div className="text-muted avatar-status-subtitle">{subTitle}</div>
        <div className="text-muted avatar-status-subtitle">{subTitle1}</div>
      </div>
    </Flex>
  );
};

export default AvatarStatus;
