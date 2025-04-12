import React from "react";
import NavigationItem from "./NavigationItem";
import { NavItemType } from "components/Guest/shared/Navigation/NavigationItem";
import ncNanoId from "utils/Guest/ncNanoId";
import { useSelector } from "react-redux";
import { RootState } from "store";

function Navigation() {
  const { categoryList } = useSelector((state: RootState) => state.product);

  const categoryMenu = (category: any, query: string) => {
    if(category.subCategory.length === 0) {
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
        type: "dropdown",
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

    if(categoryList.length > 0) {
      nav[2].type = "dropdown";
      nav[2].children = [];
      categoryList.map((cat: any) => {
        nav[2].children?.push(categoryMenu(cat, "") as NavItemType);
      })
    }
 
    return nav;
  }, [categoryList]);

  return (
    <ul className="nc-Navigation flex items-center">
      {navigation.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
