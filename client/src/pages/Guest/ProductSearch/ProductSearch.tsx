import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "components/Guest/utils/ProductCard";
import { setProducts } from "store/slices/productSlice";
import { apis } from "apis";
import { RootState } from "store";
import { useSearchParams } from "react-router-dom";
import ResponsivePagination from 'react-responsive-pagination';

const ProductSearch = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const { products } = useSelector((state: RootState) => state.product);
    const [loading, setLoading] = React.useState(false);

    const GetProductListForGuest = async () => {
        try {
            setLoading(true);
            dispatch(setProducts([]));
            const response: any = await apis.GetProductListForGuest({ search: "", page: page, query: searchParams.get("q") });
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

    React.useEffect(() => {
        if (searchParams.get("q")) {
            GetProductListForGuest();
        }
    }, [searchParams, page])

    return (
        <div
            className={`nc-PageCollection`}
            data-nc-id="PageCollection"
        >
            <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
                <div className="space-y-10 lg:space-y-14">
                    {/* HEADING */}
                    <div className="max-w-screen-sm">
                        <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold flex items-center gap-2">
                            Product Search <span className="text-3xl">({searchParams.get("q")})</span>
                        </h2>
                        <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base"></span>
                    </div>

                    <hr className="border-slate-200 dark:border-slate-700" />
                    <main style={{ marginTop: 15 }}>
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
    )
};

export default ProductSearch;