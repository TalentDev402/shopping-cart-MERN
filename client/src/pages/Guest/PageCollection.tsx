import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "components/Guest/utils/ProductCard";
import { setProducts } from "store/slices/productSlice";
import { apis } from "apis";
import { RootState } from "store";
import { useSearchParams } from "react-router-dom";
import ResponsivePagination from 'react-responsive-pagination';

export interface PageCollectionProps {
  className?: string;
}

const PageCollection: FC<PageCollectionProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [searchParams] = useSearchParams();
  const { products, categoryList } = useSelector((state: RootState) => state.product);
  const [loading, setLoading] = React.useState(false);

  const GetProductListForGuest = async (search: string) => {
    try {
      setLoading(true);
      dispatch(setProducts([]));
      const response: any = await apis.GetProductListForGuest({ search: search, page: page, query: "" });
      if (response.success) {
        dispatch(setProducts(response.products));
        setTotal(response.total);
      }
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      setLoading(false);
    }
  };

  const subCategory = (arr: any, indices: any) => {
    const result: any[] = [];
    indices.reduce((acc: any, curr: any) => {
      result.push(acc[curr].name);
      if (acc[curr].subCategory) return acc[curr].subCategory;
      else return [];
    }, arr);
    return result.join(" -> ");
  };

  const headerText = React.useMemo(() => {
    if (searchParams.get("category") && categoryList.length) {
      let id = "";
      let pos: Array<number> = [];
      String(searchParams.get("category")).split(",").forEach((str: string, index: number) => {
        if (index === 0) {
          id = str;
        } else {
          pos.push(Number(str));
        }
      });
      const filteredCategory = categoryList.filter((cat: any) => cat._id === id)[0];
      const res = subCategory(filteredCategory.subCategory, pos);
      return (
        filteredCategory.name + (pos.length > 0 ? " -> " : "") + res
      );
    } else return null;
  }, [searchParams, categoryList])

  React.useEffect(() => {
    GetProductListForGuest(searchParams.get("category") || "");
  }, [searchParams, page]);

  return (
    <div
      className={`nc-PageCollection ${className}`}
      data-nc-id="PageCollection"
    >
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          {/* HEADING */}
          <div className="max-w-screen-sm">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold flex items-center gap-2 flex-col md:flex-row">
              Products {headerText ? <span className="text-xl">({headerText})</span> : null}
            </h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base"></span>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />
          <main style={{ marginTop: 15 }}>
            {/* TABS FILTER */}
            {/* <TabFilters /> */}

            {/* LOOP ITEMS */}
            <div className="flex justify-end">
              <ResponsivePagination
                total={Math.ceil(total / 12)}
                current={page}
                onPageChange={setPage}
              />
            </div>
            {products.length > 0 ?
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-4 lg:mt-5">
                {products.map((item, index) => (
                  <ProductCard data={item} key={index} />
                ))}
              </div> :
              <h1 className="text-center text-2xl">{loading ? 'Loading...' : 'No Products'}</h1>
            }
            {/* PAGINATION */}
            <div className="flex mt-6 justify-center">
              <ResponsivePagination
                total={Math.ceil(total / 12)}
                current={page}
                onPageChange={setPage}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageCollection;
