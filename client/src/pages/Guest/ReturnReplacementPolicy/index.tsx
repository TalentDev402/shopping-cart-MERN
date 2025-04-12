import { useSelector } from "react-redux";
import { RootState } from "store";
import draftToHtml from 'draftjs-to-html';
import Utils from "utils";

const ReturnReplacementPolicy = () => {
    const { pages } = useSelector((state: RootState) => state.setting);

    return (
        <div className={`overflow-hidden relative`}>
            <div className="container py-4 lg:py-7 mt-5">
                <div className="w-[100%] px-7 py-7 md:px-14 md:py-14 lg:px-28 lg:py-28"
                    style={{
                        height: '100%',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: (pages && pages.returnReplacementPolicy && pages.returnReplacementPolicy.image) ?
                            `url(${process.env.REACT_APP_SERVER_URL}/${pages.returnReplacementPolicy.image})` : undefined
                    }}
                >
                    {(pages && pages.returnReplacementPolicy) ?
                        <div className="text-neutral-6000 dark:text-neutral-400 px-4 py-4 md:px-8 md:py-8 lg:px-16 lg:py-16 bg-[#FFFFFF80]"
                            dangerouslySetInnerHTML={{ __html: Utils.replaceEmptyTagsWithBrTag(draftToHtml(pages.returnReplacementPolicy.text)) }}
                        /> :
                        null
                    }
                </div>
            </div>
        </div>
    );
};

export default ReturnReplacementPolicy