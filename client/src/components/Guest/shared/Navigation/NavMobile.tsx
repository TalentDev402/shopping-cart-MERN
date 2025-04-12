import React from "react";
import ButtonClose from "components/Guest/shared/ButtonClose/ButtonClose";
import Logo from "components/Guest/shared/Logo/Logo";
import { Disclosure } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { NavItemType } from "./NavigationItem";
import { useSelector } from "react-redux";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { RootState } from "store";
import ncNanoId from "utils/Guest/ncNanoId";

export interface NavMobileProps {
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({
  onClickClose,
}) => {
  const { categoryList } = useSelector((state: RootState) => state.product);

  const categoryMenu = (category: any, query: string) => {
    if (category.subCategory.length === 0) {
      let q = query === "" ? category._id : query;
      return {
        id: ncNanoId(),
        href: `/products?category=${q}`,
        name: category.name
      }
    } else {
      let q = query === "" ? category._id : query;
      let nav = {
        id: ncNanoId(),
        href: `/products?category=${q}`,
        name: category.name,
        children: [] as NavItemType[]
      }
      category.subCategory.map((cat: any, index: 0) => {
        nav.children?.push(categoryMenu(cat, `${q},${index}`) as NavItemType);
      });
      return nav;
    }
  }

  const navigation = React.useMemo(() => {
    let nav: NavItemType[] = [
      {
        id: ncNanoId(),
        href: "/",
        name: "主頁"
      },
      {
        id: ncNanoId(),
        href: "/about",
        name: "關於珍品匯",
        type: "dropdown",
        children: [
          {
            id: ncNanoId(),
            name: "關於我們",
            href: "/about"
          },
          {
            id: ncNanoId(),
            name: "公司動態",
            href: "/news"
          }
        ]
      },
      {
        id: ncNanoId(),
        href: "/products",
        name: "所有產品"
      },
      {
        id: ncNanoId(),
        href: "/contact",
        name: "聯絡我們"
      },
      {
        id: ncNanoId(),
        href: "/service",
        name: "營養諮詢"
      },
      {
        id: ncNanoId(),
        href: "/",
        name: "購物須知",
        type: "dropdown",
        children: [
          {
            id: ncNanoId(),
            name: "會員積分",
            href: "/membership"
          },
          {
            id: ncNanoId(),
            name: "購物與付款",
            href: "/shopping-payment-terms"
          },
          {
            id: ncNanoId(),
            name: "送貨安排",
            href: "/delivery-methods"
          },
          {
            id: ncNanoId(),
            name: "隱私政策",
            href: "/privacy-policy"
          },
          {
            id: ncNanoId(),
            name: "退換貨政策",
            href: "/return-replacement-policy"
          },
        ]
      },
    ];

    if (categoryList.length > 0) {
      nav[2].children = [];
      categoryList.map((cat: any) => {
        nav[2].children?.push(categoryMenu(cat, "") as NavItemType);
      })
    }

    return nav;
  }, [categoryList]);

  const _renderMenuChild = (
    item: NavItemType,
    itemClass = " pl-3 text-neutral-900 dark:text-neutral-200 font-medium "
  ) => {
    return (
      <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={i.href + index} as="li">
            <NavLink
              to={i.href || undefined}
              className={({ isActive }) =>
                `flex text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 mt-0.5 pr-4 ${itemClass} ${isActive ? "text-secondary" : ""
                }`
              }
            >
              <span className={`py-2.5 ${!i.children ? "block w-full" : ""}`} onClick={onClickClose}>{i.name}</span>
              {i.children && (
                <span
                  className="flex items-center flex-grow"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="flex justify-end flex-grow"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-slate-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </NavLink>
            {i.children && (
              <Disclosure.Panel>
                {_renderMenuChild(
                  i,
                  "pl-3 text-slate-600 dark:text-slate-400 "
                )}
              </Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const _renderItem = (item: NavItemType, index: number) => {
    return (
      <Disclosure
        key={index}
        as="li"
        className="text-slate-900 dark:text-white"
      >
        <NavLink
          className={({ isActive }) =>
            `flex w-full items-center py-2.5 px-4 font-medium uppercase tracking-wide text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ${isActive ? "text-secondary" : ""
            }`
          }
          to={item.href || undefined}
        >
          <span
            className={!item.children ? "block w-full" : ""}
            onClick={onClickClose}
          >
            {item.name}
          </span>
          {item.children && (
            <span
              className="block flex-grow"
              onClick={(e) => e.preventDefault()}
            >
              <Disclosure.Button
                as="span"
                className="flex justify-end flex-grow"
              >
                <ChevronDownIcon
                  className="ml-2 h-4 w-4 text-neutral-500"
                  aria-hidden="true"
                />
              </Disclosure.Button>
            </span>
          )}
        </NavLink>
        {item.children && (
          <Disclosure.Panel>{_renderMenuChild(item)}</Disclosure.Panel>
        )}
      </Disclosure>
    );
  };

  return (
    <div className="overflow-y-auto w-full h-screen py-2 transition transform shadow-lg ring-1 dark:ring-neutral-700 bg-white dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800">
      <div className="py-6 px-5">
        <Logo />
        <span className="absolute right-2 top-2 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>
      </div>
      <ul className="flex flex-col py-6 px-2 space-y-1">
        {navigation.map(_renderItem)}
      </ul>
    </div>
  );
};

export default NavMobile;
