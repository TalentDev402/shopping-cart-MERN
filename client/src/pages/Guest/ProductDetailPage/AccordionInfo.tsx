import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";

const DEMO_DATA = [
  {
    name: "Description",
    content:
      "Fashion is a form of self-expression and autonomy at a particular period and place and in a specific context, of clothing, footwear, lifestyle, accessories, makeup, hairstyle, and body posture.",
  },
];

interface Props {
  panelClassName?: string;
  data?: typeof DEMO_DATA;
}

const AccordionInfo: FC<Props> = ({
  panelClassName = "p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6",
  data = DEMO_DATA,
}) => {
  const [seeFlag, setSeeFlag] = useState(false);

  return (
    <div className="w-full rounded-2xl space-y-2.5">
      {/* ============ */}
      {data.map((item, index) => {
        return (
          <Disclosure key={index} defaultOpen={index < 2}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                  <span>{item.name}</span>
                  {!open ? (
                    <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  )}
                </Disclosure.Button>

                <Disclosure.Panel
                  className={`whitespace-pre-wrap ${panelClassName}`}
                  as="div"
                >
                  {item.content ?
                    !seeFlag ?
                      <>
                        {item.content.slice(0, 150)}{(!seeFlag && item.content.length >= 150) ?
                          <p className="text-[#FF0000] hover:text-[#0000FF] cursor-pointer" onClick={() => setSeeFlag(!seeFlag)}>See more...</p> :
                          <></>
                        }
                      </>
                      : item.content : ""}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      })}

      {/* ============ */}
    </div>
  );
};

export default AccordionInfo;
