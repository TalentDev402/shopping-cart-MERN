import { SocialType } from "components/Guest/shared/SocialsShare/SocialsShare";
import { FC } from "react";
import facebook from "assets/images/socials/facebook.svg";
import whatsapp from "assets/images/socials/whatsapp.svg";
import instagram from "assets/images/socials/instagram.svg";

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
  socials?: SocialType[];
}

const SocialsList: FC<SocialsListProps> = ({
  className = "",
  itemClass = "block w-6 h-6",
  socials,
}) => {
  const SocialName = (type: string) => {
    if (type === "facebook") return "Facebook";
    else if (type === "instagram") return "Instagram";
    else if (type === "whatsapp") return "Whatsapp";
  }

  const SocialIcon = (type: string) => {
    if (type === "facebook") return facebook;
    else if (type === "instagram") return instagram;
    else if (type === "whatsapp") return whatsapp;
  }

  return (
    <nav
      className={`nc-SocialsList flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
      data-nc-id="SocialsList"
    >
      {socials && socials.map((item, i) => (
        <a
          key={i}
          className={`${itemClass}`}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          title={SocialName(item.type)}
        >
          <img src={SocialIcon(item.type)} alt="" />
        </a>
      ))}
    </nav>
  );
};

export default SocialsList;
