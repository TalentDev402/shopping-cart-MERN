import React, { FC } from "react";

export interface SocialsShareProps {
  className?: string;
  itemClass?: string;
}

export interface SocialType {
  type: string;
  link: string;
}

const SocialsShare: FC<SocialsShareProps> = ({
  className = "grid gap-[6px]",
  itemClass = "w-7 h-7 text-base hover:bg-neutral-100",
}) => {
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        key={index}
        href={item.link}
        className={`rounded-full leading-none flex items-center justify-center bg-white text-neutral-6000 ${itemClass}`}
        // title={`Share on ${item.name}`}
      >
        {/* <i className={item.icon}></i> */}
      </a>
    );
  };

  return (
    <div className={`nc-SocialsShare ${className}`} data-nc-id="SocialsShare">
      {/* {socials.map(renderItem)} */}
    </div>
  );
};

export default SocialsShare;
