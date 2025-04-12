import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import AccordionInfo from "./AccordionInfo";
import BagIcon from "components/Guest/utils/BagIcon";
import NcInputNumber from "components/Guest/utils/NcInputNumber";
import Prices from "components/Guest/utils/Prices";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setCart } from "store/slices/cartSlice";
import toast from "react-hot-toast";
import { apis } from "apis";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

export interface ProductDetailPageProps {
  className?: string;
}

const ProductDetailPage: FC<ProductDetailPageProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<any>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [quantitySelected, setQuantitySelected] = React.useState(0);
  const [images, setImages] = React.useState<Array<string>>([]);
  const [imageIndex, setImageIndex] = React.useState(0);

  const AddTocart = async () => {
    if (currentUser) {
      try {
        if (quantitySelected === 0) {
          toast.error("Please select inventory quantity.");
          return;
        }
        const response: any = await apis.AddCart({ productId: id, quantity: quantitySelected });
        if (response.success == false)
          toast.success("There aren't enough amount of items in here.");
        else {
          dispatch(setCart(response.cart));
          toast.success("Items has been added to the cart.");
        }
      } catch (err: any) {
        toast.error(err.response.data.message);
      }
    } else {
      navigate("/login");
    }
  };

  const GetProductDetailById = async () => {
    if (typeof id === 'string') {
      try {
        const response: any = await apis.GetProductById(id);
        if (response.success) {
          setProduct(response.product);
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  React.useEffect(() => {
    if (id) {
      GetProductDetailById();
    }
  }, [id]);

  React.useEffect(() => {
    if (product) {
      let imgs: Array<string> = [];
      if (product.photo) {
        imgs.push(`${process.env.REACT_APP_SERVER_URL}/${product.photo}`);
      }
      if (product.thumbnails) {
        product.thumbnails.forEach((thumb: string) => {
          imgs.push(`${process.env.REACT_APP_SERVER_URL}/${thumb}`);
        })
      }
      setImages(imgs);
    }
  }, [product])

  const renderSectionContent = () => {
    return (
      <div className="space-y-7 2xl:space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            {product?.name}
          </h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={product?.sellingPrice}
            />
          </div>
        </div>

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className="flex space-x-3.5">
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 p-2 sm:p-3.5 rounded-full">
            <NcInputNumber
              defaultValue={quantitySelected}
              onChange={setQuantitySelected}
              quantity={product?.quantity}
            />
          </div>
          <ButtonPrimary
            className="flex-1 flex-shrink-0"
            onClick={AddTocart}
          >
            <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            <span className="ml-3">Add to cart</span>
          </ButtonPrimary>
        </div>
        <div className="text-sm">
          <span className="font-bold">Quantity:&nbsp;</span> {product?.quantity}
        </div>

        {/*  */}
        <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo data={[{
          name: 'Description',
          content: product?.description
        }]} />
      </div>
    );
  };

  return (
    <div className={`nc-ProductDetailPage ${className}`}>
      {/* MAIn */}
      <main className="container mt-5 lg:mt-11">
        <div className="md:flex md:justify-evenly">
          {/* CONTENT */}
          <div className="w-full md:w-[40%]">
            {/* HEADING */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-16">
                {images.length > 0 ?
                  <img
                    src={images[imageIndex]}
                    className="w-full rounded-2xl object-cover"
                    alt="product detail"
                  /> : null}
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={10}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination]}
                className="mt-5"
              >
                {images.map((img: string, index: number) =>
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      onClick={() => setImageIndex(index)}
                      className={`cursor-pointer rounded-2xl border border-dotted border-[2px] ${index === imageIndex ? 'border-[#FF0000]' : 'border-neutral-100'}`}
                      alt="product thumbnail" />
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
          </div>
          {/* SIDEBAR */}
          <div className="w-full md:w-[40%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
            {renderSectionContent()}
          </div>
        </div>

      </main>
    </div>
  );
};

export default ProductDetailPage;
