import { FC, useEffect, useState } from "react";

import Next from "components/Guest/shared/NextPrev/Next";
import Prev from "components/Guest/shared/NextPrev/Prev";
import useInterval from "react-use/lib/useInterval";
import useBoolean from "react-use/lib/useBoolean";
import { useSelector } from "react-redux";
import { RootState } from "store";

export interface SectionHero2Props {
  className?: string;
}

let TIME_OUT: NodeJS.Timeout | null = null;

const SectionHero2: FC<SectionHero2Props> = ({ className = "" }) => {
  // =================
  const [indexActive, setIndexActive] = useState(0);
  const [isRunning, toggleIsRunning] = useBoolean(true);
  const [banner, setBanner] = useState<any>([]);
  const { pages } = useSelector((state: RootState) => state.setting);

  useEffect(() => {
    setBanner(pages?.dashboard.banner);
  },[pages]);

  useInterval(
    () => {
      handleAutoNext();
    },
    isRunning ? 5500 : null
  );
  //

  const handleAutoNext = () => {
    setIndexActive((state) => {
      if (state >= banner.length - 1) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= banner.length - 1) {
        return 0;
      }
      return state + 1;
    });
    handleAfterClick();
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return banner.length - 1;
      }
      return state - 1;
    });
    handleAfterClick();
  };

  const handleAfterClick = () => {
    toggleIsRunning(false);
    if (TIME_OUT) {
      clearTimeout(TIME_OUT);
    }
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true);
    }, 1000);
  };
  // =================

  const renderItem = (index: number) => {
    const isActive = indexActive === index;
    const item = banner[index];
    if (!isActive) {
      return null;
    }
    return (
      <div
        className={`nc-SectionHero2Item nc-SectionHero2Item--animation flex flex-col-reverse lg:flex-col relative overflow-hidden ${className}`}
        key={index}
      >
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex justify-center">
          {banner.map((_ : any, index : any) => {
            const isActive = indexActive === index;
            return (
              <div
                key={index}
                onClick={() => {
                  setIndexActive(index);
                  handleAfterClick();
                }}
                className={`relative px-1 py-1.5 cursor-pointer`}
              >
                <div
                  className={`relative w-20 h-1 shadow-sm rounded-md bg-white`}
                >
                  {isActive && (
                    <div
                      className={`nc-SectionHero2Item__dot absolute inset-0 bg-slate-900 rounded-md ${isActive ? " " : " "
                        }`}
                    ></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>


        {/* BG */}
        {/* <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#F7F0EA]">
          <img
            className="absolute w-full h-full object-fit"
            src={backgroundImg}
            alt="hero"
          />
        </div> */}

        <div className="relative container inset-0">

          <Prev
            className="absolute left-0 sm:left-0 top-1/3 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-slate-700"
            btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
            svgSize="w-6 h-6"
            onClickPrev={handleClickPrev}
          />
          <Next
            className="absolute right-0 sm:right-0 top-1/3 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-slate-700"
            btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
            svgSize="w-6 h-6"
            onClickNext={handleClickNext}
          />
          {/* <div
            className={`relative z-[1] w-full max-w-3xl space-y-8 sm:space-y-14 nc-SectionHero2Item__left`}
          >
            <div className="space-y-5 sm:space-y-6">
              <span className="nc-SectionHero2Item__subheading block text-base md:text-xl text-slate-700 font-medium">
                {item.subHeading}
              </span>
              <h2 className="nc-SectionHero2Item__heading font-semibold text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl !leading-[114%] text-slate-900">
                {item.heading}
              </h2>
            </div>

            <ButtonPrimary
              className="nc-SectionHero2Item__button dark:bg-slate-900"
              sizeClass="py-3 px-6 sm:py-5 sm:px-9"
              // href={item.btnLink as any}
            >
              <span>{item.btnText}</span>
            </ButtonPrimary>
          </div> */}
          {/* <div className="mt-10 lg:mt-0 lg:absolute right-0 bottom-0 top-0 w-full max-w-xl xl:max-w-2xl 2xl:max-w-3xl py-5"> */}
          <img
            className="object-fill w-full h-[40vw] nc-SectionHero2Item__image"
            src={`${process.env.REACT_APP_SERVER_URL}/${item}`}
          />
          {/* </div> */}
        </div>
      </div>
    );
  };

  return <>{banner.map((_ : any, index : any) => renderItem(index))}</>;
};

export default SectionHero2;
