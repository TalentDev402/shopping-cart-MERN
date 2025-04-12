import React from "react";
import SectionHero2 from "components/Guest/utils/SectionHero/SectionHero2";
import SectionSliderProductCard from "components/Guest/utils/SectionSliderProductCard";
import { apis } from "apis";
import { useSelector } from "react-redux";
import { RootState } from "store";

function PageHome() {
  const { productDisplay } = useSelector((state: RootState) => state.setting);
  const [displayProduct, setDisplayProducts] = React.useState<any>([]);

  const GetDisplayProduct = async () => {
    try {
      let func: any = [];
      productDisplay.forEach((product: any) => {
        func.push(apis.GetDisplayProductList(product.tag._id));
      })

      const respones = await Promise.all(func);
      let productList: any = [];
      respones.forEach((response: any) => {
        productList.push(response.products);
      });
      setDisplayProducts(productList);
    } catch (err) {
      console.log(err);
    }
  }

  React.useEffect(() => {
    if (productDisplay) {
      GetDisplayProduct();
    }
  }, [productDisplay])

  return (
    <div className="nc-PageHome relative overflow-hidden">
      {/* SECTION HERO */}
      <div className="mt-0 md:mt-5">
        <SectionHero2 />
      </div>
      {productDisplay && productDisplay.map((display: any, index: number) => (
        <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32" key={index}>
          {(displayProduct[index] && displayProduct[index].length > 0) ?
            <SectionSliderProductCard heading={display.title} data={displayProduct[index]} />
            : null}
        </div>
      ))}
    </div>
  );
}

export default PageHome;
