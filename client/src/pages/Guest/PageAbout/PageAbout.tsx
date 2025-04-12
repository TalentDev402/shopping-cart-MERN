import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import draftToHtml from 'draftjs-to-html';
import Utils from "utils";

export interface PageAboutProps {
  className?: string;
}

const PageAbout: FC<PageAboutProps> = ({ className = "" }) => {
  const { pages } = useSelector((state: RootState) => state.setting);

  return (
    <div className={`nc-PageAbout overflow-hidden relative ${className}`} data-nc-id="PageAbout">
      <div className="container py-8 lg:py-14 space-y-8 lg:space-y-14 bg-[#F4EFE3] mt-5">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-[100%] md:w-[60%]">
            {(pages && pages.about) ?
              <div className="text-neutral-6000 dark:text-neutral-400"
                dangerouslySetInnerHTML={{ __html: Utils.replaceEmptyTagsWithBrTag(draftToHtml(pages.about.text)) }}
              /> :
              null
            }
          </div>
          <div className="hidden md:w-[40%] md:block">
            {(pages && pages.about && pages.about.image) ? <img alt="about" src={`${process.env.REACT_APP_SERVER_URL}/${pages.about.image}`} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageAbout;
