import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper/modules";
import { apis } from "apis";

const NewsPage = () => {
  const [images, setImages] = React.useState<Array<any>>([]);

  const GetPages = async () => {
    try {
      const response: any = await apis.GetPagesSetting();
      if (response.success) {
        setImages(response.pages.newPage.images || []);
      }
    } catch (err) {
      console.log(err);
    }
  };
  React.useEffect(() => {
    GetPages();
  }, []);

  return (
    <div
      className={`nc-PageNews overflow-hidden relative data-nc-id="PageNews"`}
    >
      <div className="container py-4 lg:py-8 mt-5">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="news-swiper"
        >
          {images.reverse().map((image: any, index: number) => (
            <SwiperSlide key={index}>
              <img
                src={`${process.env.REACT_APP_SERVER_URL}/${image}`}
                className={`cursor-pointer`}
                alt="news"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NewsPage;
