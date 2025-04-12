import React from "react";

const Icon = (props: any) => {
  const { type, className } = props;
  return <>{React.createElement(type, { className: className })}</>;
};

export default Icon;
